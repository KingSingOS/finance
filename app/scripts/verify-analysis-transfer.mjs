import assert from 'node:assert/strict';
import {createTransferEnvelope,planImport} from '../src/app/financial-analysis/analysis-transfer.mjs';
let assertions=0;
function check(fn){fn();assertions++;}
const record={id:'original-1',name:'Synthetic example',period:'January 2026',date:'2026-01-31',createdAt:'2026-02-01T00:00:00Z',data:{balanceSheet:{totalCurrentAssets:300,totalCurrentLiabilities:100,inventory:100,cashAndCashEquivalents:50,shortTermInvestments:25,totalLiabilities:200,totalEquity:300,totalAssets:500,accountsReceivable:80,accountsPayable:40},incomeStatement:{revenue:1000,costOfGoodsSold:600,grossProfit:400,operatingIncome:250,netIncome:200,interestExpense:10},originalNote:'Retain this extension'},ratios:{currentRatio:999,netProfitMargin:999},extension:{sourceNote:'Retain original metadata'}};
const raw=JSON.stringify([record]);
const envelope=createTransferEnvelope(raw);
const parsed=JSON.parse(envelope),plan=planImport(envelope);
check(()=>assert.deepEqual(plan.additions[0].original,record));
check(()=>assert.equal(plan.additions[0].recalculated.ratios.currentRatio.value,3));
check(()=>assert.equal(plan.additions[0].original.ratios.currentRatio,999));
check(()=>assert.equal(plan.additions[0].context.currency,'unknown'));
check(()=>assert.equal(plan.additions[0].context.ratioUnits,'unknown'));
check(()=>assert.equal(plan.additions[0].context.operatingIncomeBasis,'unknown'));
check(()=>assert.equal(plan.additions[0].discrepancies[0].reason,'source_units_unknown'));
const explicit=createTransferEnvelope(raw,{currency:'KES',ratioUnits:'fraction-or-times',operatingIncomeBasis:'reported-operating-income'});
check(()=>assert.equal(planImport(explicit).additions[0].discrepancies[0].reason,'stored_result_differs_or_unavailable'));
const baseline=JSON.stringify(plan.additions);
check(()=>assert.equal(planImport(envelope,baseline).additions.length,0));
check(()=>assert.equal(planImport(envelope,baseline).skipped.length,1));
check(()=>assert.equal(baseline,JSON.stringify(plan.additions)));
const reexport=createTransferEnvelope(JSON.stringify(plan.additions.map(x=>x.original)),{...plan.additions[0].context});
check(()=>assert.deepEqual(JSON.parse(reexport),parsed));
const changed=structuredClone(record);changed.name='different';
check(()=>assert.throws(()=>planImport(createTransferEnvelope(JSON.stringify([changed])),baseline),/conflicting/));
check(()=>assert.throws(()=>planImport(explicit,baseline),/conflicting/));
check(()=>assert.throws(()=>createTransferEnvelope(JSON.stringify([record,record])),/Duplicate/));
const two=structuredClone(record);two.id='new-id';
const mixed=planImport(createTransferEnvelope(JSON.stringify([record,two])),baseline);
check(()=>assert.equal(mixed.additions.length,1));
check(()=>assert.equal(mixed.skipped.length,1));
const invalidSecond=structuredClone(two);invalidSecond.data.balanceSheet.inventory='100';
check(()=>assert.throws(()=>planImport(createTransferEnvelope(JSON.stringify([record,invalidSecond]))),/number/));
check(()=>assert.equal(baseline,JSON.stringify(plan.additions)));
for(const json of ['null','{}','[null]','not JSON'])check(()=>assert.throws(()=>createTransferEnvelope(json)));
for(const key of ['__proto__','constructor','prototype']){
 const hostile=JSON.parse(raw);hostile[0].extension=JSON.parse(`{"${key}":{"polluted":true}}`);
 check(()=>assert.throws(()=>createTransferEnvelope(JSON.stringify(hostile)),/Unsafe/));
}
check(()=>assert.equal({}.polluted,undefined));
const badVersion={...parsed,schemaVersion:'financial-analysis-transfer/99'};
check(()=>assert.throws(()=>planImport(JSON.stringify(badVersion)),/version/));
check(()=>assert.throws(()=>createTransferEnvelope(raw,{currency:'usd'}),/Currency/));
check(()=>assert.throws(()=>createTransferEnvelope(raw,{ratioUnits:'percentage'}),/units/));
const financeDetailed={...parsed,inputModel:'finance-detailed'};
check(()=>assert.throws(()=>planImport(JSON.stringify(financeDetailed)),/separate adapter/));
const missing=structuredClone(record);delete missing.data.balanceSheet.totalCurrentLiabilities;
check(()=>assert.equal(planImport(createTransferEnvelope(JSON.stringify([missing]))).additions[0].recalculated.ratios.currentRatio.status,'missing_input'));
const zero=structuredClone(record);zero.data.balanceSheet.totalCurrentLiabilities=0;
check(()=>assert.equal(planImport(createTransferEnvelope(JSON.stringify([zero]))).additions[0].recalculated.ratios.currentRatio.value,null));
const forged=JSON.parse(baseline);forged[0].recalculated={fake:'untrusted'};
check(()=>assert.equal(planImport(envelope,JSON.stringify(forged)).additions.length,0));
check(()=>assert.throws(()=>planImport(envelope,JSON.stringify([...plan.additions,...plan.additions])),/Duplicate existing/));
check(()=>assert.equal(raw,JSON.stringify([record])));
check(()=>assert.throws(()=>createTransferEnvelope(' '.repeat(5_000_001)),/5MB/));

// Independent review regressions: JSON boundary types, UTF8 bytes and capacity.
for(const currency of [['USD'],null,123,{},true]){
 check(()=>assert.throws(()=>createTransferEnvelope(raw,{currency}),/Currency/));
 const altered=structuredClone(parsed);altered.context.currency=currency;
 check(()=>assert.throws(()=>planImport(JSON.stringify(altered)),/Currency/));
}
const multibyte=structuredClone(record);multibyte.extension.note='\u00e9'.repeat(2_500_000);
const unicodeJSON=JSON.stringify([multibyte]);
check(()=>assert.ok(unicodeJSON.length<5_000_000));
check(()=>assert.ok(new TextEncoder().encode(unicodeJSON).byteLength>5_000_000));
check(()=>assert.throws(()=>createTransferEnvelope(unicodeJSON),/5MB/));
const imported=Array.from({length:1000},(_,i)=>({...record,id:`capacity-${i}`}));
const full=planImport(createTransferEnvelope(JSON.stringify(imported)));
check(()=>assert.equal(full.additions.length,1000));
check(()=>assert.equal(planImport(createTransferEnvelope(JSON.stringify(imported)),JSON.stringify(full.additions)).skipped.length,1000));
check(()=>assert.throws(()=>planImport(envelope,JSON.stringify(full.additions)),/Combined record limit/));
const almost=JSON.stringify(full.additions.slice(0,999));
const last=planImport(envelope,almost);
check(()=>assert.equal(last.additions.length,1));
check(()=>assert.equal(planImport(envelope,JSON.stringify([...full.additions.slice(0,999),...last.additions])).skipped.length,1));
const reordered=structuredClone(record);reordered.extension={sourceNote:'Retain original metadata'};
const reverse=Object.fromEntries(Object.entries(reordered).reverse());
check(()=>assert.equal(planImport(createTransferEnvelope(JSON.stringify([reverse])),baseline).skipped.length,1));
const invalidRatio=structuredClone(record);invalidRatio.ratios.currentRatio='3';
const badRatioPlan=planImport(createTransferEnvelope(JSON.stringify([invalidRatio]),{ratioUnits:'fraction-or-times'}));
check(()=>assert.equal(badRatioPlan.additions[0].recalculated.ratios.currentRatio.value,3));
check(()=>assert.equal(badRatioPlan.additions[0].original.ratios.currentRatio,'3'));
check(()=>assert.equal(badRatioPlan.additions[0].discrepancies[0].reason,'stored_result_differs_or_unavailable'));

assert.ok(assertions>=59,'Transfer suite must exercise retained regression cases');
console.log(`PASS: ${assertions} financial-analysis transfer assertions (synthetic records only)`);
