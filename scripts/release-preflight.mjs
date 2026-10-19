import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

export const TARGET = Object.freeze({
  account: '3dc71700513ac596ca229c78e6845353',
  worker: '1984-startup-finance-worker',
  database: '145206fd-2992-47a3-96e8-b420b4611a7a',
});

export function verifySource({ sha, main, runs, confirmed }) {
  assert.equal(confirmed, 'true', 'Explicit release confirmation is required');
  assert.match(sha ?? '', /^[0-9a-f]{40}$/, 'A full lowercase commit SHA is required');
  assert.equal(main, sha, 'Release must match the current main revision');
  assert.ok(runs.some(run => run.head_sha === sha && run.event === 'push' &&
    run.head_branch === 'main' && run.status === 'completed' && run.conclusion === 'success'),
  'A successful main push Run Checks workflow is required for this revision');
}

export function verifyResources({ account, database, settings }) {
  assert.equal(account, TARGET.account, 'Only the approved BOS account may be used');
  assert.equal(database.uuid, TARGET.database, 'Configured D1 database must exist in BOS');
  assert.equal(database.name, 'startup-finance-worksheets', 'D1 database name mismatch');
  assert.ok(Array.isArray(settings.bindings), 'Worker bindings must be readable');
  assert.ok(settings.bindings.some(b => b.type === 'd1' && b.name === 'DB' &&
    b.id === TARGET.database), 'Existing Worker DB binding must match the configured D1');
  assert.ok(settings.bindings.some(b => b.type === 'durable_object_namespace' &&
    b.name === 'WORKSHEET_COORDINATOR' && b.class_name === 'WorksheetCoordinatorDurableObject'),
  'Existing worksheet coordinator binding must be verified');
}

async function getJson(url, token) {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    redirect: 'error', signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`Metadata request rejected: HTTP ${response.status}`);
  return response.json();
}

async function main() {
  const env = process.env;
  assert.equal(env.GITHUB_REPOSITORY, 'KingSingOS/finance', 'Unexpected repository');
  assert.ok(env.GH_TOKEN && env.CLOUDFLARE_API_TOKEN && env.CLOUDFLARE_ACCOUNT_ID,
    'GitHub and Cloudflare release credentials must be configured');
  const base = 'https://api.github.com/repos/KingSingOS/finance';
  const branch = await getJson(`${base}/branches/main`, env.GH_TOKEN);
  const runs = await getJson(`${base}/actions/workflows/checks.yml/runs?event=push&head_sha=${encodeURIComponent(env.RELEASE_SHA)}&status=success&per_page=100`, env.GH_TOKEN);
  verifySource({ sha: env.RELEASE_SHA, main: branch.commit.sha,
    runs: runs.workflow_runs ?? [], confirmed: env.RELEASE_CONFIRMED });
  const cf = `https://api.cloudflare.com/client/v4/accounts/${TARGET.account}`;
  const db = await getJson(`${cf}/d1/database/${TARGET.database}`, env.CLOUDFLARE_API_TOKEN);
  const worker = await getJson(`${cf}/workers/scripts/${TARGET.worker}/settings`, env.CLOUDFLARE_API_TOKEN);
  assert.equal(db.success, true, 'D1 metadata read failed');
  assert.equal(worker.success, true, 'Worker metadata read failed');
  verifyResources({ account: env.CLOUDFLARE_ACCOUNT_ID, database: db.result, settings: worker.result });
  console.log('Exact source CI and existing BOS resource bindings verified; no resources changed.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(() => {
    // Never echo API response bodies, environment variables or tokens.
    console.error('Release preflight denied. Check exact source CI, configured credentials and reconciled BOS resource bindings.');
    process.exitCode = 1;
  });
}
