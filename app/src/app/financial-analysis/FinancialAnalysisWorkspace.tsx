import { useEffect, useRef, useState } from 'react';
import { calculateAggregateRatios } from './aggregate-ratios.mjs';
import { createTransferEnvelope, planImport } from './analysis-transfer.mjs';

import { normalizeStatement, type Data } from './normalizeStatement';
type Analysis = { id: string; name: string; period: string; date: string; createdAt: string; data: Data };
type Context = { currency: string; ratioUnits: string; operatingIncomeBasis: string };
type Entry = { sourceApplication: string; original: Analysis; context: Context; discrepancies?: unknown[] };
const identity = (entry: Entry) => JSON.stringify([entry.sourceApplication, entry.original.id]);
const balance = ['cashAndCashEquivalents', 'shortTermInvestments', 'accountsReceivable', 'inventory', 'propertyPlantEquipment', 'longTermInvestments', 'accountsPayable', 'shortTermDebt', 'longTermDebt', 'commonStock', 'retainedEarnings'];
const income = ['revenue', 'costOfGoodsSold', 'operatingExpenses', 'interestExpense', 'incomeTaxExpense'];
const empty = (): Data => ({ balanceSheet: Object.fromEntries(balance.map(k => [k, null])), incomeStatement: Object.fromEntries(income.map(k => [k, null])) });
const label = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());

function download(filename: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Ratios({ entry }: { entry: Entry }) {
  const result = calculateAggregateRatios(entry.original.data);
  return <><p>Currency: {entry.context.currency}; operating-income basis: {entry.context.operatingIncomeBasis}. Candidate formulas; ratios are fractions or times. No industry benchmarks.</p><table><caption>{entry.original.name} — {entry.original.period}</caption><thead><tr><th scope="col">Ratio</th><th scope="col">Value / availability</th></tr></thead><tbody>{Object.entries(result.ratios).map(([key, value]) => <tr key={key}><th scope="row">{label(key)}</th><td>{value.status === 'ok' ? value.value?.toLocaleString(undefined, { maximumFractionDigits: 4 }) : label(value.status)}</td></tr>)}</tbody></table></>;
}
export function FinancialAnalysisWorkspace() {
  const [view, setView] = useState('entry'), [data, setData] = useState<Data>(empty), [name, setName] = useState(''), [period, setPeriod] = useState(''), [date, setDate] = useState('');
  const [currency, setCurrency] = useState('unknown'), [entries, setEntries] = useState<Entry[]>([]), [selected, setSelected] = useState<string | null>(null), [checked, setChecked] = useState<string[]>([]), [error, setError] = useState(''), [preview, setPreview] = useState<Entry[] | null>(null);
  const importGeneration = useRef(0), importEnvelope = useRef<string | null>(null);
  useEffect(() => {
    if (entries.length === 0) return;
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warnBeforeLeaving);
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving);
  }, [entries.length]);
  const current = entries.find(e => identity(e) === selected);
  const save = (event: React.FormEvent) => {
    event.preventDefault(); setError('');
    if (entries.length >= 1000) { setError('At most 1000 records can be retained. Export and remove records first.'); return; }
    if (!name.trim() || !period.trim() || !date || (currency !== 'unknown' && !/^[A-Z]{3}$/.test(currency))) { setError('Enter name, period and date; use a three-letter currency code or unknown.'); return; }
    const normalized = normalizeStatement(data);
    if (Object.values(normalized).some(group => Object.values(group).some(value => value !== null && !Number.isFinite(value)))) { setError('Amounts or derived totals exceed the supported numeric range. Correct the input before retaining this analysis.'); return; }
    const original: Analysis = { id: crypto.randomUUID(), name: name.trim(), period: period.trim(), date, createdAt: new Date().toISOString(), data: normalized };
    const entry = { sourceApplication: 'finance', original, context: { currency, ratioUnits: 'fraction-or-times', operatingIncomeBasis: 'reported-operating-income' } };
    setEntries(previous => [...previous, entry]); setSelected(identity(entry)); setView('results');
  };
  const exportEntry = (entry: Entry) => {
    try { download('financial-analysis.json', createTransferEnvelope(JSON.stringify([entry.original]), { ...entry.context, sourceApplication: entry.sourceApplication })); } catch (cause) { setError(String(cause)); }
  };
  const importFile = async (file?: File) => {
    if (!file) return; const generation = ++importGeneration.current; setError(''); setPreview(null); importEnvelope.current = null;
    try { if (file.size > 5_000_000) throw new Error('File exceeds 5 MB'); const envelope = await file.text(); const plan = planImport(envelope, JSON.stringify(entries)); if (generation !== importGeneration.current) return; importEnvelope.current = envelope; setPreview(plan.additions as Entry[]); }
    catch (cause) { if (generation === importGeneration.current) setError(String(cause)); }
  };
  const acceptImport = () => {
    try {
      if (!importEnvelope.current) throw new Error('Select a file again');
      const currentPlan = planImport(importEnvelope.current, JSON.stringify(entries));
      const additions = currentPlan.additions as Entry[];
      if (entries.length + additions.length > 1000) throw new Error('Import would exceed the 1000-record capacity');
      setEntries(previous => [...previous, ...additions]); ++importGeneration.current; importEnvelope.current = null; setPreview(null);
    } catch (cause) { setError(String(cause)); }
  };
  return <main style={{ maxWidth: 1000, margin: 'auto', padding: 24, fontFamily: 'system-ui' }}>
    <h1>Financial analysis workspace</h1><p>Local candidate. Records stay in this tab's memory and disappear on refresh. Export each record to keep it. No server or automatic browser-storage access.</p>
    <nav aria-label="Finance tools">{['entry', 'results', 'saved', 'comparison'].map(item => <button key={item} type="button" aria-current={view === item ? 'page' : undefined} onClick={() => setView(item)}>{label(item)}</button>)}</nav>
    {error && <p role="alert">{error}</p>}
    {view === 'entry' && <form onSubmit={save}><h2>Enter a financial statement</h2><p>Leave missing amounts blank. Enter zero explicitly when known. Amounts must share one currency and period.</p>
      <label>Analysis name <input required maxLength={512} value={name} onChange={e => setName(e.target.value)} /></label><br />
      <label>Period <input required maxLength={512} placeholder="e.g. 2026 Q1" value={period} onChange={e => setPeriod(e.target.value)} /></label><br />
      <label>Statement date <input required type="date" value={date} onChange={e => setDate(e.target.value)} /></label><br />
      <label>Currency code or unknown <input required value={currency} onChange={e => setCurrency(e.target.value)} /></label>
      {([['balanceSheet', balance], ['incomeStatement', income]] as const).map(([group, fields]) => <fieldset key={group}><legend>{label(group)}</legend>{fields.map(key => <div key={key}><label>{label(key)} <input type="number" step="any" value={data[group][key] ?? ''} onChange={event => { const raw = event.target.value; setData(previous => ({ ...previous, [group]: { ...previous[group], [key]: raw === '' ? null : Number(raw) } })); }} /></label></div>)}</fieldset>)}
      <button type="submit">Calculate and retain in this tab</button></form>}
    {view === 'results' && <section><h2>Analysis results</h2>{current ? <><Ratios entry={current} /><button onClick={() => exportEntry(current)}>Export original inputs as JSON</button><details><summary>Normalized financial statement</summary><pre>{JSON.stringify(current.original.data, null, 2)}</pre></details></> : <p>Select an analysis from Saved or enter one first.</p>}</section>}
    {view === 'saved' && <section><h2>Analyses in this tab</h2>{entries.length === 0 && <p>No analyses retained.</p>}<ul>{entries.map(entry => <li key={identity(entry)}>{entry.original.name} — {entry.original.period} <button onClick={() => { setSelected(identity(entry)); setView('results'); }}>Open</button> <button onClick={() => exportEntry(entry)}>Export JSON</button> <button onClick={() => setEntries(previous => previous.filter(e => e !== entry))}>Remove from this tab</button></li>)}</ul>
      <label>Preview a versioned financial-analysis JSON file <input type="file" accept="application/json,.json" onChange={e => { void importFile(e.target.files?.[0]); e.target.value = ''; }} /></label>
      {preview && <div><h3>Import preview — no changes applied</h3><p>{preview.length} new record(s). Original source records are preserved; recalculated results may differ.</p><ul>{preview.map((entry, index) => <li key={index}>{entry.original.name}: currency {entry.context.currency}; {entry.discrepancies?.length ?? 0} calculation discrepancies</li>)}</ul><button onClick={acceptImport}>Accept preview into this tab</button><button onClick={() => { ++importGeneration.current; importEnvelope.current = null; setPreview(null); }}>Cancel import</button></div>}</section>}
    {view === 'comparison' && <section><h2>Compare analyses</h2><p>Select records from the same company, currency and comparable period basis. Unknown currency prevents comparison.</p>{entries.map(entry => <label key={identity(entry)} style={{ display: 'block' }}><input type="checkbox" checked={checked.includes(identity(entry))} onChange={e => setChecked(previous => e.target.checked ? [...previous, identity(entry)] : previous.filter(id => id !== identity(entry)))} />{entry.original.name} — {entry.original.period}</label>)}{(() => { const chosen = entries.filter(e => checked.includes(identity(e))); if (chosen.length < 2) return <p>Select at least two analyses.</p>; if (new Set(chosen.map(e => e.original.name)).size !== 1 || chosen.some(e => e.context.currency === 'unknown') || new Set(chosen.map(e => e.context.currency)).size !== 1 || chosen.some(e => e.context.operatingIncomeBasis === 'unknown') || new Set(chosen.map(e => e.context.operatingIncomeBasis)).size !== 1) return <p role="status">Comparison unavailable: company, known currency and known operating-income basis must match. Period comparability still requires your judgement.</p>; return chosen.map(entry => <section key={identity(entry)}><Ratios entry={entry} /></section>); })()}</section>}
  </main>;
}
