'use strict';

// Required process-isolated gate. No Cloudflare account, token or live binding is used.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createRequire } = require('node:module');

const workerRoot = path.resolve(process.argv[2] || '.');
const output = path.resolve(process.argv[3] || 'finance-collaboration-result.json');
const checks = [];
const receipt = { status: 'running', checks, remoteBindings: false, isolation: 'fresh Miniflare instance and ephemeral storage in a separate process' };
let mf, socket, outboundAttempts = 0, disposed = false;
const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');
const write = () => fs.writeFileSync(output, JSON.stringify({ ...receipt, outboundAttempts }, null, 2));
const watchdog = setTimeout(() => {
  receipt.status = 'failed';
  receipt.error = 'Standalone gate exceeded 45-second process budget';
  receipt.exitCode = 2;
  write();
  process.exit(2);
}, 45000);

async function bounded(promise, milliseconds, label) {
  let timer;
  try {
    return await Promise.race([promise, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(label)), milliseconds);
    })]);
  } finally { clearTimeout(timer); }
}

function packageVersion(entry, expectedName) {
  let directory = path.dirname(entry);
  for (;;) {
    const candidate = path.join(directory, 'package.json');
    if (fs.existsSync(candidate)) {
      const metadata = JSON.parse(fs.readFileSync(candidate, 'utf8'));
      if (metadata.name === expectedName) return metadata.version;
    }
    const parent = path.dirname(directory);
    if (parent === directory) throw new Error('Cannot identify installed ' + expectedName);
    directory = parent;
  }
}

function messagePromise(client) {
  return new Promise((resolve, reject) => {
    client.addEventListener('message', event => {
      try { resolve(JSON.parse(String(event.data))); }
      catch { reject(new Error('Invalid collaboration notification JSON')); }
    }, { once: true });
    client.addEventListener('error', () => reject(new Error('Local collaboration socket error')), { once: true });
  });
}

async function closeSocket(client) {
  if (client.readyState === 3) return;
  const closed = new Promise((resolve, reject) => {
    client.addEventListener('close', resolve, { once: true });
    client.addEventListener('error', () => reject(new Error('Socket error during close')), { once: true });
  });
  client.close(1000, 'Synthetic check complete');
  await bounded(closed, 3000, 'Local collaboration close handshake did not finish');
}

(async () => {
  try {
    const requireWorker = createRequire(path.join(workerRoot, 'package.json'));
    const miniflareEntry = requireWorker.resolve('miniflare');
    const { Miniflare, Log, LogLevel } = requireWorker('miniflare');
    const requireWrangler = createRequire(requireWorker.resolve('wrangler/package.json'));
    const esbuildEntry = requireWrangler.resolve('esbuild');
    const esbuild = requireWrangler('esbuild');
    receipt.miniflareVersion = packageVersion(miniflareEntry, 'miniflare');
    receipt.esbuildVersion = packageVersion(esbuildEntry, 'esbuild');
    assert.match(receipt.miniflareVersion, /^3\./, 'Use the declared direct Miniflare 3 dependency');
    const source = path.join(workerRoot, 'src/index.ts');
    receipt.sourceIndexSha256 = hash(fs.readFileSync(source));
    const config = fs.readFileSync(path.join(workerRoot, 'wrangler.local.toml'), 'utf8');
    const compatibilityDate = config.match(/^compatibility_date\s*=\s*"([^"\r\n]+)"/m)?.[1];
    assert.ok(compatibilityDate, 'Use existing local compatibility date');
    receipt.compatibilityDate = compatibilityDate;
    const bundled = await esbuild.build({
      entryPoints: [source], absWorkingDir: workerRoot, bundle: true,
      write: false, format: 'esm', platform: 'browser', target: 'es2022',
      loader: { '.html': 'text' }, external: ['cloudflare:*'], logLevel: 'silent'
    });
    const script = bundled.outputFiles[0].text;
    receipt.bundleSha256 = hash(script);
    mf = new Miniflare({
      name: 'finance-synthetic-collaboration', modules: true, script,
      compatibilityDate, host: '127.0.0.1', port: 0,
      d1Databases: { DB: 'finance-synthetic-ephemeral' }, d1Persist: false,
      durableObjects: { WORKSHEET_COORDINATOR: 'WorksheetCoordinatorDurableObject' },
      durableObjectsPersist: false, cachePersist: false,
      outboundService: async () => {
        outboundAttempts++;
        throw new Error('External networking is blocked by the synthetic gate');
      },
      log: new Log(LogLevel.NONE)
    });
    await bounded(mf.ready, 12000, 'Local Miniflare startup timed out');
    const db = await mf.getD1Database('DB');
    const schema = fs.readFileSync(path.join(workerRoot, 'migrations/0001_initial_schema.sql'), 'utf8');
    receipt.migrationSha256 = hash(schema);
    for (const statement of schema.split(';').filter(part => part.trim())) {
      await db.prepare(statement).run();
    }
    checks.push('Actual repository migration initializes fresh local database');
    const id = 'ProcessNotifyWorksheet';
    const key = 'SyntheticSecret'; // Synthetic only, never included in receipt or logs.
    const origin = 'https://finance.invalid/api/objects/';
    const created = await mf.dispatchFetch(origin + id + '-' + key);
    assert.equal(created.status, 200, 'Create synthetic worksheet');
    assert.equal((await created.json()).version, 1);
    const upgrade = await mf.dispatchFetch(origin + id + '/ws', { headers: { Upgrade: 'websocket' } });
    assert.equal(upgrade.status, 101, 'Actual Worker must upgrade local client');
    socket = upgrade.webSocket;
    assert.ok(socket, 'Upgrade must supply client WebSocket');
    socket.accept();
    checks.push('Actual Worker and Durable Object accept local worksheet client');
    const notified = bounded(messagePromise(socket), 4000, 'No collaboration notification after update');
    void notified.catch(() => {});
    const syntheticData = { synthetic: true, amount: 123 };
    const update = await mf.dispatchFetch(origin + id, {
      method: 'PUT', headers: { 'X-Edit-Key': key }, body: JSON.stringify(syntheticData)
    });
    assert.equal(update.status, 200, 'Actual update must succeed');
    assert.equal((await update.json()).version, 2);
    const frame = await notified;
    assert.equal(frame.type, 'update');
    assert.equal(frame.worksheetId, id);
    assert.equal(frame.version, 2);
    checks.push('Persisted update emits exact worksheet version-2 notification');
    const reread = await mf.dispatchFetch(origin + id);
    assert.equal(reread.status, 200);
    const stored = await reread.json();
    assert.deepEqual(stored.data, syntheticData);
    assert.equal(stored.version, 2);
    checks.push('Independent HTTP readback retains actual data and version');
    await closeSocket(socket);
    socket = undefined;
    checks.push('Client and server complete bounded close handshake');
    assert.equal(outboundAttempts, 0, 'Journey must not attempt external networking');
    receipt.status = 'passed';
    receipt.exitCode = 0;
  } catch (error) {
    receipt.status = 'failed';
    receipt.exitCode = 1;
    receipt.error = String(error).replaceAll('SyntheticSecret', '[synthetic-capability]').slice(0, 2000);
  } finally {
    if (socket) {
      try { await closeSocket(socket); }
      catch (error) {
        receipt.status = 'failed'; receipt.exitCode = 1;
        receipt.closeError = String(error).slice(0, 500);
      }
    }
    if (mf) {
      try {
        await bounded(mf.dispose(), 8000, 'Miniflare disposal timed out');
        disposed = true;
        checks.push('Local Miniflare instance disposed');
      } catch (error) {
        receipt.status = 'failed'; receipt.exitCode = 1;
        receipt.disposeError = String(error).slice(0, 500);
      }
    }
    // Failed disposal can leave startup/child resources alive. Retain the hard
    // process budget in that case instead of allowing an unbounded runner hang.
    if (!mf || disposed) clearTimeout(watchdog);
    write();
    console.log(JSON.stringify({ status: receipt.status, checks: checks.length, exitCode: receipt.exitCode }));
    process.exitCode = receipt.exitCode;
  }
})();
