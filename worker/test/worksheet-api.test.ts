import { SELF, env, fetchMock } from 'cloudflare:test';
import { beforeAll, afterAll, describe, it, expect } from 'vitest';

// Synthetic capability only; never log it or any returned editKey.
const id = 'SyntheticWorksheet';
const key = 'SyntheticSecret';
const base = 'https://finance.invalid/api/objects/';
const data = { synthetic: true, amount: 123 };
interface WorksheetResponse {
  created?: boolean;
  version: number;
  data: unknown;
  lastModified: string;
  editKey?: string;
}

beforeAll(async () => {
  fetchMock.activate();
  fetchMock.disableNetConnect();
  await env.DB.exec('CREATE TABLE IF NOT EXISTS finance_worksheets (id TEXT PRIMARY KEY, edit_key TEXT NOT NULL, worksheet_data TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1, last_modified TEXT NOT NULL, created_at TEXT NOT NULL);');
});
afterAll(() => fetchMock.deactivate());

describe('Worksheet API local runtime contract (not project-admin RBAC)', () => {
  it('does not create a missing worksheet on read-only lookup', async () => {
    expect((await SELF.fetch(base + 'MissingWorksheet')).status).toBe(404);
    const row = await env.DB.prepare('SELECT COUNT(*) AS n FROM finance_worksheets').first<{ n: number }>();
    expect(row?.n).toBe(0);
  });

  it('creates, reads, denies unauthorized update, and persists an authorized update', async () => {
    const created = await SELF.fetch(base + id + '-' + key);
    expect(created.status).toBe(200);
    const initial = await created.json<WorksheetResponse>();
    expect(initial.created).toBe(true);
    expect(initial.version).toBe(1);
    expect(initial).not.toHaveProperty('editKey');

    // Current documented capability model allows anyone knowing the id to read.
    const read = await SELF.fetch(base + id);
    expect(read.status).toBe(200);
    expect(await read.json<WorksheetResponse>()).not.toHaveProperty('editKey');
    expect((await SELF.fetch(base + id + '-WrongSecret')).status).toBe(403);

    for (const headers of [new Headers(), new Headers({ 'X-Edit-Key': 'WrongSecret' })]) {
      const denied = await SELF.fetch(base + id, { method: 'PUT', headers, body: JSON.stringify(data) });
      expect(denied.status).toBe(403);
    }
    const unchanged = await env.DB.prepare('SELECT version, worksheet_data FROM finance_worksheets WHERE id = ?').bind(id).first<{ version: number; worksheet_data: string }>();
    expect(unchanged?.version).toBe(1);
    expect(JSON.parse(unchanged?.worksheet_data || 'null')).toEqual(initial.data);

    const update = await SELF.fetch(base + id, { method: 'PUT', headers: { 'X-Edit-Key': key }, body: JSON.stringify(data) });
    expect(update.status).toBe(200);
    const result = await update.json<WorksheetResponse>();
    expect(result.data).toEqual(data);
    expect(result.version).toBe(2);
    const reread = await (await SELF.fetch(base + id)).json<WorksheetResponse>();
    expect(reread.data).toEqual(data);
    expect(reread.version).toBe(2);
  });

  it('rejects malformed JSON without storing a worksheet', async () => {
    expect((await SELF.fetch(base + 'BadJsonWorksheet', { method: 'PUT', body: '{' })).status).toBe(400);
    expect((await SELF.fetch(base + 'BadJsonWorksheet')).status).toBe(404);
  });

  it('rejects invalid ids and unsupported API methods', async () => {
    expect((await SELF.fetch(base + 'invalid_worksheet')).status).toBe(404);
    expect((await SELF.fetch(base + id, { method: 'DELETE' })).status).toBe(405);
  });

  it('answers preflight without creating records', async () => {
    const response = await SELF.fetch(base + 'PreflightWorksheet', { method: 'OPTIONS' });
    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Methods')).toContain('PUT');
    expect((await SELF.fetch(base + 'PreflightWorksheet')).status).toBe(404);
  });

  it('rejects invalid legacy conversion and invalid calculation inputs', async () => {
    expect((await SELF.fetch('https://finance.invalid/api/legacy/convert', { method: 'POST', body: '{' })).status).toBe(400);
    expect((await SELF.fetch('https://finance.invalid/api/calculate', { method: 'POST', body: JSON.stringify({ preMoneyValuation: -1 }) })).status).toBe(400);
  });
});
