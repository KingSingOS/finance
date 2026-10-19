import {calculateAggregateRatios} from './aggregate-ratios.mjs';

export const envelopeVersion='financial-analysis-transfer/1';
const forbidden=new Set(['__proto__','prototype','constructor']);
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
function fail(message){throw new Error(message);}
function object(value,label){if(value===null||typeof value!=='object'||Array.isArray(value))fail(`${label}: object required`);}
function text(value,label){if(typeof value!=='string'||!value.trim()||value.length>512)fail(`${label}: nonempty text required`);}
function inspect(value,depth=0){
 if(depth>24)fail('JSON nesting exceeds limit');
 if(value===null||typeof value==='boolean'||typeof value==='string')return;
 if(typeof value==='number'){if(!Number.isFinite(value))fail('Nonfinite number');return;}
 if(typeof value!=='object')fail('JSON value required');
 for(const key of Object.keys(value)){if(forbidden.has(key))fail('Unsafe object key');inspect(value[key],depth+1);}
}
function parse(json){
 if(typeof json!=='string'||new TextEncoder().encode(json).byteLength>5_000_000)fail('Expected JSON text within 5MB limit');
 const parsed=JSON.parse(json);inspect(parsed);return parsed;
}
function stable(value){
 if(Array.isArray(value))return '['+value.map(stable).join(',')+']';
 if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+stable(value[k])).join(',')+'}';
 return JSON.stringify(value);
}
function validateOriginal(record){
 object(record,'record');for(const key of ['id','name','period','date','createdAt'])text(record[key],key);
 object(record.data,'data');object(record.data.balanceSheet,'balanceSheet');object(record.data.incomeStatement,'incomeStatement');
 // Unknown original fields are retained. Known amounts may be absent or null (unknown),
 // but numeric strings and other incompatible types are rejected instead of coerced.
 const groups={balanceSheet:['cashAndCashEquivalents','shortTermInvestments','accountsReceivable','inventory','totalCurrentAssets','propertyPlantEquipment','longTermInvestments','totalAssets','accountsPayable','shortTermDebt','totalCurrentLiabilities','longTermDebt','totalLiabilities','commonStock','retainedEarnings','totalEquity'],incomeStatement:['revenue','costOfGoodsSold','grossProfit','operatingExpenses','operatingIncome','interestExpense','incomeBeforeTax','incomeTaxExpense','netIncome']};
 for(const [group,keys] of Object.entries(groups))for(const key of keys){
  const value=record.data[group][key];
  if(own(record.data[group],key)&&value!==null&&typeof value!=='number')fail(`${group}.${key}: number or null required`);
 }
 if(own(record,'ratios'))object(record.ratios,'original ratios');
}
function validateContext(context){
 object(context,'context');
 if(context.ratioUnits!=='unknown'&&context.ratioUnits!=='fraction-or-times')fail('Unsupported or unacknowledged source ratio units');
 if(typeof context.currency!=='string'||(context.currency!=='unknown'&&!/^[A-Z]{3}$/.test(context.currency)))fail('Currency must be explicit three-letter code or unknown');
 if(!['unknown','reported-operating-income','EBIT','EBITDA'].includes(context.operatingIncomeBasis))fail('Operating income basis required');
}
function validateEnvelope(envelope){
 object(envelope,'envelope');
 if(envelope.schemaVersion!==envelopeVersion)fail('Unsupported envelope version');
 if(!['v0-blcbk','finance'].includes(envelope.sourceApplication))fail('Unsupported source application');
 if(envelope.inputModel!=='v0-aggregate')fail('Detailed Finance statements require a separate adapter');
 validateContext(envelope.context);
 if(!Array.isArray(envelope.records)||envelope.records.length>1000)fail('At most 1000 records required');
 const ids=new Set();
 for(const record of envelope.records){validateOriginal(record);if(ids.has(record.id))fail('Duplicate source record ID');ids.add(record.id);}
 return envelope;
}
export function createTransferEnvelope(recordsJSON,{sourceApplication='v0-blcbk',currency='unknown',ratioUnits='unknown',operatingIncomeBasis='unknown'}={}){
 const records=parse(recordsJSON);
 const envelope={schemaVersion:envelopeVersion,sourceApplication,inputModel:'v0-aggregate',context:{currency,ratioUnits,operatingIncomeBasis},records};
 validateEnvelope(envelope);
 return JSON.stringify(envelope,null,2);
}
export function planImport(envelopeJSON,existing=[]){
 const envelope=validateEnvelope(parse(envelopeJSON));
 // Baseline is supplied as JSON so getters/proxies and caller mutations cannot execute
 // during validation. This function only returns a plan, never writes to persistence.
 if(typeof existing!=='string'){
  if(!Array.isArray(existing)||existing.length)fail('Existing records must be JSON text');
  existing='[]';
 }
 const baseline=parse(existing);
 if(!Array.isArray(baseline)||baseline.length>1000)fail('Existing record limit');
 const known=new Map();
 for(const item of baseline){
  object(item,'existing item');text(item.sourceApplication,'existing source');validateOriginal(item.original);validateContext(item.context);
  const id=JSON.stringify([item.sourceApplication,item.original.id]);
  if(known.has(id))fail('Duplicate existing record ID');known.set(id,item);
 }
 const additions=[],skipped=[];
 for(const original of envelope.records){
  const identity=JSON.stringify([envelope.sourceApplication,original.id]);
  const previous=known.get(identity);
  if(previous){
   if(stable(previous.original)!==stable(original)||stable(previous.context)!==stable(envelope.context))fail('Existing identity has conflicting content or context');
   skipped.push(identity);continue;
  }
  const recalculated=calculateAggregateRatios(original.data);
  const discrepancies=[];
  for(const [key,result] of Object.entries(recalculated.ratios)){
   if(original.ratios&&own(original.ratios,key)){
    const stored=original.ratios[key];
    if(envelope.context.ratioUnits==='unknown')discrepancies.push({ratio:key,reason:'source_units_unknown'});
    else if(result.status!=='ok'||typeof stored!=='number'||Math.abs(stored-result.value)>1e-9*Math.max(1,Math.abs(result.value)))discrepancies.push({ratio:key,reason:'stored_result_differs_or_unavailable'});
   }
  }
  additions.push({sourceApplication:envelope.sourceApplication,inputModel:envelope.inputModel,context:{...envelope.context},original,recalculated,discrepancies});
 }
 if(baseline.length+additions.length>1000)fail('Combined record limit');
 return {schemaVersion:envelopeVersion,mode:'dry-run',additions,skipped,existingCount:baseline.length,sourceCount:envelope.records.length};
}
