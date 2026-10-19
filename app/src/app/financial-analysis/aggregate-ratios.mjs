// New compatibility candidate. No copied source or implied license reassignment.
// Preserve imported aggregates rather than inventing missing detailed accounts.
export const contractVersion = 'aggregate-ratios/0.1-candidate';
const definitions = {
 currentRatio: ['balanceSheet.totalCurrentAssets','balanceSheet.totalCurrentLiabilities'],
 quickRatio: [['balanceSheet.totalCurrentAssets','balanceSheet.inventory'],'balanceSheet.totalCurrentLiabilities'],
 cashRatio: [['balanceSheet.cashAndCashEquivalents','balanceSheet.shortTermInvestments','add'],'balanceSheet.totalCurrentLiabilities'],
 debtToEquityRatio: ['balanceSheet.totalLiabilities','balanceSheet.totalEquity'],
 debtRatio: ['balanceSheet.totalLiabilities','balanceSheet.totalAssets'],
 interestCoverageRatio: ['incomeStatement.operatingIncome','incomeStatement.interestExpense'],
 grossProfitMargin: ['incomeStatement.grossProfit','incomeStatement.revenue'],
 operatingProfitMargin: ['incomeStatement.operatingIncome','incomeStatement.revenue'],
 netProfitMargin: ['incomeStatement.netIncome','incomeStatement.revenue'],
 returnOnAssets: ['incomeStatement.netIncome','balanceSheet.totalAssets'],
 returnOnEquity: ['incomeStatement.netIncome','balanceSheet.totalEquity'],
 assetTurnoverRatio: ['incomeStatement.revenue','balanceSheet.totalAssets'],
 inventoryTurnoverRatio: ['incomeStatement.costOfGoodsSold','balanceSheet.inventory'],
 receivablesTurnoverRatio: ['incomeStatement.revenue','balanceSheet.accountsReceivable'],
 payablesTurnoverRatio: ['incomeStatement.costOfGoodsSold','balanceSheet.accountsPayable'],
};
function read(data, path) {
 const [group,key] = path.split('.');
 const value = data?.[group]?.[key];
 if (value === undefined || value === null) return {status:'missing_input'};
 return typeof value === 'number' && Number.isFinite(value)
  ? {status:'ok',value} : {status:'invalid_input'};
}
function operand(data, spec) {
 if (!Array.isArray(spec)) return read(data,spec);
 const a=read(data,spec[0]), b=read(data,spec[1]);
 if(a.status!=='ok') return a;
 if(b.status!=='ok') return b;
 return {status:'ok',value:spec[2]==='add'? a.value+b.value : a.value-b.value};
}
export function calculateAggregateRatios(data) {
 const ratios={};
 for(const [key,[numerator,denominator]] of Object.entries(definitions)) {
  const n=operand(data,numerator), d=operand(data,denominator);
  const status=n.status!=='ok'?n.status:d.status!=='ok'?d.status:d.value===0?'zero_denominator':'ok';
  const value=status==='ok'?n.value/d.value:null;
  ratios[key]=value!==null && !Number.isFinite(value)
   ? {status:'overflow',value:null}
   : {status,value};
 }
 return {contractVersion, units:'fraction-or-times', ratios};
}
