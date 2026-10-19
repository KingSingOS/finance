import { lazy, Suspense, useEffect, useState } from 'react';
import { FinancialAnalysisWorkspace } from './financial-analysis/FinancialAnalysisWorkspace';
import { resetWorksheetUrl } from './workspaceRouting';

const CapTableWorksheet = lazy(() => import('./cap-table/page'));
type Tool = 'analysis' | 'cap-table';
function selectedTool(): Tool {
  const explicit = new URLSearchParams(window.location.search).get('tool');
  if (explicit === 'analysis' || explicit === 'cap-table') return explicit;
  // Legacy worksheet links use the hash for object IDs and edit keys. Never rewrite it.
  return window.location.hash.length > 1 ? 'cap-table' : 'analysis';
}

export default function FinanceWorkspace() {
  const [tool, setTool] = useState<Tool>(selectedTool);
  const [worksheetVisited, setWorksheetVisited] = useState(() => selectedTool() === 'cap-table');
  const [worksheetVersion, setWorksheetVersion] = useState(0);
  useEffect(() => {
    const restore = () => { const next = selectedTool(); setTool(next); if (next === 'cap-table') setWorksheetVisited(true); };
    window.addEventListener('popstate', restore);
    window.addEventListener('hashchange', restore);
    return () => { window.removeEventListener('popstate', restore); window.removeEventListener('hashchange', restore); };
  }, []);
  const open = (next: Tool) => {
    const url = new URL(window.location.href); url.searchParams.set('tool', next);
    window.history.pushState({}, '', url);
    if (next === 'cap-table') setWorksheetVisited(true);
    setTool(next);
  };
  const newWorksheet = () => {
    resetWorksheetUrl(window.location, window.history);
    setWorksheetVersion(version => version + 1);
  };
  return <>
    <header style={{ padding: 16, borderBottom: '1px solid currentColor' }}>
      <h1>Finance workspace</h1>
      <p>Financial analysis and ownership modelling in one application. Each tool preserves its own records and calculation contract.</p>
      <nav aria-label="Finance workspace modules">
        <button type="button" aria-current={tool === 'analysis' ? 'page' : undefined} onClick={() => open('analysis')}>Financial analysis</button>
        <button type="button" aria-current={tool === 'cap-table' ? 'page' : undefined} onClick={() => open('cap-table')}>Cap table and funding</button>
      </nav>
      <p>Analysis records remain in this tab's memory: export them before refreshing. Opening cap-table starts its existing configured worksheet service, which remains active when switching tools until this page closes. Analysis records are not uploaded or shared with that service.</p>
    </header>
    <div hidden={tool !== 'analysis'}><FinancialAnalysisWorkspace /></div>
    {worksheetVisited && <div hidden={tool !== 'cap-table'}><Suspense fallback={<p role="status">Loading cap-table worksheet…</p>}><CapTableWorksheet key={worksheetVersion} onCreateNew={newWorksheet} /></Suspense></div>}
  </>;
}
