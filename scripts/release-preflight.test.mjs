import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TARGET, verifySource, verifyResources } from './release-preflight.mjs';

const sha = 'a'.repeat(40);
const source = () => ({ sha, main: sha, confirmed: 'true', runs: [{
  head_sha: sha, head_branch: 'main', event: 'push', status: 'completed', conclusion: 'success',
}] });
const resources = () => ({ account: TARGET.account,
  database: { uuid: TARGET.database, name: 'startup-finance-worksheets' },
  settings: { bindings: [
    { type: 'd1', name: 'DB', id: TARGET.database },
    { type: 'durable_object_namespace', name: 'WORKSHEET_COORDINATOR', class_name: 'WorksheetCoordinatorDurableObject' },
  ] },
});

test('only confirmed current main with successful push CI passes', () => {
  assert.doesNotThrow(() => verifySource(source()));
  for (const change of [{ confirmed: 'false' }, { sha: 'main' }, { main: 'b'.repeat(40) }, { runs: [] }]) {
    assert.throws(() => verifySource({ ...source(), ...change }));
  }
  for (const change of [{ event: 'pull_request' }, { head_branch: 'other' }, { status: 'queued' },
    { conclusion: 'failure' }, { head_sha: 'b'.repeat(40) }]) {
    const value = source(); Object.assign(value.runs[0], change);
    assert.throws(() => verifySource(value));
  }
});

test('missing, foreign and mismatched live resources deny release', () => {
  assert.doesNotThrow(() => verifyResources(resources()));
  for (const mutate of [
    v => { v.account = 'foreign'; },
    v => { v.database.uuid = 'foreign'; },
    v => { v.database.name = 'other'; },
    v => { v.settings.bindings = []; },
    v => { v.settings.bindings[0].id = 'other'; },
    v => { v.settings.bindings.pop(); },
  ]) {
    const value = resources(); mutate(value);
    assert.throws(() => verifyResources(value));
  }
});
