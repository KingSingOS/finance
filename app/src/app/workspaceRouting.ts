export function canonicalizeLegacyWorksheetUrl(location: Pick<Location, 'href'>, history: Pick<History, 'replaceState'>): void {
  const url = new URL(location.href);
  if (url.hash.length > 1 && !url.searchParams.has('tool')) {
    url.searchParams.set('tool', 'cap-table');
    history.replaceState({}, '', url);
  }
}

export function resetWorksheetUrl(location: Pick<Location, 'href'>, history: Pick<History, 'replaceState'>): void {
  const url = new URL(location.href);
  url.searchParams.set('tool', 'cap-table');
  url.hash = '';
  history.replaceState({}, '', url);
}
