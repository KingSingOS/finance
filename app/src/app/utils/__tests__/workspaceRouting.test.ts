import { describe, expect, it } from '@jest/globals';
import { canonicalizeLegacyWorksheetUrl, resetWorksheetUrl } from '../../workspaceRouting';

describe('unified workspace legacy worksheet routing', () => {
  it('resets only worksheet location using history without reloading the document', () => {
    let replacement = '';
    resetWorksheetUrl({ href: 'https://example.test/?campaign=demo#sheet:edit' }, { replaceState: (_data, _unused, url) => { replacement = String(url); } });
    const url = new URL(replacement);
    expect(url.hash).toBe('');
    expect(url.searchParams.get('tool')).toBe('cap-table');
    expect(url.searchParams.get('campaign')).toBe('demo');
  });
  it('preserves object and edit-key hash while making New reload remain in cap-table', () => {
    let replacement = '';
    canonicalizeLegacyWorksheetUrl({ href: 'https://example.test/#worksheet:edit-key' }, { replaceState: (_data, _unused, url) => { replacement = String(url); } });
    const resulting = new URL(replacement);
    expect(resulting.hash).toBe('#worksheet:edit-key');
    expect(resulting.searchParams.get('tool')).toBe('cap-table');
    resulting.hash = '';
    expect(resulting.searchParams.get('tool')).toBe('cap-table');
  });
  it('does not redirect explicit analysis with an old worksheet hash', () => {
    let replaced = false;
    canonicalizeLegacyWorksheetUrl({ href: 'https://example.test/?tool=analysis#old-sheet' }, { replaceState: () => { replaced = true; } });
    expect(replaced).toBe(false);
  });
  it('leaves a fresh analysis URL and unrelated query untouched', () => {
    let replaced = false;
    canonicalizeLegacyWorksheetUrl({ href: 'https://example.test/?campaign=demo' }, { replaceState: () => { replaced = true; } });
    expect(replaced).toBe(false);
  });
});
