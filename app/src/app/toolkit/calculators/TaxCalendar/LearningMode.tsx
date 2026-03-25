import { LearningLayout } from '../../layouts/LearningLayout'

const OBLIGATIONS = [
  {
    tax: 'PAYE',
    fullName: 'Pay As You Earn',
    deadline: '9th of following month',
    who: 'All employers with salaried employees',
    penalty: '25% of unpaid tax or KES 10,000 (whichever is higher), plus 1% interest/month',
    color: 'border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/10',
    notes: 'Must file even if nil return. Director salaries are also subject to PAYE.',
  },
  {
    tax: 'VAT',
    fullName: 'Value Added Tax',
    deadline: '20th of following month',
    who: 'Businesses with turnover > KES 5M/year (mandatory registration)',
    penalty: '5% of unpaid VAT + 1% interest/month',
    color: 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/10',
    notes: 'Standard rate 16%. Zero-rated and exempt supplies exist. File monthly on iTax.',
  },
  {
    tax: 'Withholding Tax',
    fullName: 'Withholding Tax (WHT)',
    deadline: '20th of following month',
    who: 'Payers of dividends, royalties, management fees, rent, professional fees',
    penalty: '10% of underpaid tax + 1% interest/month',
    color: 'border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/10',
    notes: 'Rates vary: 5% on dividends (residents), 15% (non-residents), 5% on management fees.',
  },
  {
    tax: 'Instalment Tax',
    fullName: 'Corporate Tax Instalments',
    deadline: '4th month (Apr), 6th (Jun), 9th (Sep), 12th (Dec) — by 20th',
    who: 'Companies with expected tax liability > KES 40,000',
    penalty: '20% penalty if instalment is less than 110% of prior year tax',
    color: 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/10',
    notes: 'Each instalment = 25% of estimated annual tax. Based on prior year tax or current year estimate.',
  },
  {
    tax: 'Corporate Tax',
    fullName: 'Corporation Tax (Final)',
    deadline: '4 months after financial year-end (e.g. April 30 for Dec year-end)',
    who: 'All incorporated companies',
    penalty: '5% per month on outstanding balance',
    color: 'border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/10',
    notes: 'Standard rate 30%. Listed companies: 25%. Newly listed companies: 20% for 5 years.',
  },
  {
    tax: 'Turnover Tax',
    fullName: 'Turnover Tax (TOT)',
    deadline: '20th of following month',
    who: 'Businesses with annual turnover KES 1M – 50M (alternative to VAT)',
    penalty: '5% of unpaid tax + interest',
    color: 'border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/10',
    notes: 'Rate: 1% of gross turnover. Cannot deduct expenses. Opt-out of TOT by registering for VAT.',
  },
  {
    tax: 'Rental Income Tax',
    fullName: 'Monthly Rental Income Tax',
    deadline: '20th of following month',
    who: 'Residential property landlords with gross rent KES 288,001 – 15M/year',
    penalty: '5% + 1% interest/month',
    color: 'border-teal-200 dark:border-teal-700 bg-teal-50 dark:bg-teal-900/10',
    notes: 'Rate: 10% of gross monthly rent. No expense deductions. File and pay via iTax.',
  },
  {
    tax: 'NHIF',
    fullName: 'National Hospital Insurance Fund',
    deadline: '9th of following month',
    who: 'All employers',
    penalty: 'KES 2,000 per month or 5% of contribution (whichever is higher)',
    color: 'border-cyan-200 dark:border-cyan-700 bg-cyan-50 dark:bg-cyan-900/10',
    notes: 'Employee-only contribution. Employer remits deducted amounts. File via NHIF portal.',
  },
  {
    tax: 'NSSF',
    fullName: 'National Social Security Fund',
    deadline: '9th of following month',
    who: 'All employers with employees',
    penalty: '5% per month on arrears + 1% interest/month',
    color: 'border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/10',
    notes: 'Employer matches employee contribution. Maximum KES 2,160 each (employee + employer) per month.',
  },
]

const CHECKLIST = [
  { day: 'By 9th', items: ['PAYE (all employees)', 'NHIF (all employees)', 'NSSF (all employees)', 'Housing Levy (employee + employer portions)'] },
  { day: 'By 20th', items: ['VAT (if registered)', 'Withholding Tax (if applicable)', 'Turnover Tax (if on TOT scheme)', 'Rental Income Tax (if applicable)', 'Instalment Tax (April, June, September, December)'] },
]

export default function TaxCalendarLearning() {
  return (
    <LearningLayout
      title="Kenya Tax Calendar"
      description="KRA obligations, deadlines, and penalties"
    >
      {/* Overview */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Two key dates every month</h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          Most Kenyan tax obligations fall on just two dates each month:
          the <strong>9th</strong> for employment-related taxes (PAYE, NHIF, NSSF, Housing Levy),
          and the <strong>20th</strong> for transaction and turnover taxes (VAT, WHT, TOT, Rental).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border-2 border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/10 p-4">
            <p className="font-bold text-red-700 dark:text-red-300 text-lg">9th of Month</p>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mt-1 mb-2">Employment Taxes</p>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>• PAYE</li>
              <li>• NHIF</li>
              <li>• NSSF</li>
              <li>• Housing Levy</li>
            </ul>
          </div>
          <div className="rounded-lg border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/10 p-4">
            <p className="font-bold text-blue-700 dark:text-blue-300 text-lg">20th of Month</p>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mt-1 mb-2">Transaction & Turnover Taxes</p>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>• VAT</li>
              <li>• Withholding Tax</li>
              <li>• Turnover Tax (TOT)</li>
              <li>• Rental Income Tax</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Each obligation */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">All Tax Obligations Explained</h2>
        <div className="space-y-3">
          {OBLIGATIONS.map(ob => (
            <div key={ob.tax} className={`rounded-lg border p-4 space-y-2 ${ob.color}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{ob.tax}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{ob.fullName}</p>
                </div>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap bg-white/60 dark:bg-gray-900/40 rounded px-2 py-0.5">
                  Due: {ob.deadline}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Who files: </span>
                  <span className="text-gray-600 dark:text-gray-400">{ob.who}</span>
                </div>
                <div>
                  <span className="font-semibold text-red-700 dark:text-red-300">Penalty: </span>
                  <span className="text-gray-600 dark:text-gray-400">{ob.penalty}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 italic">{ob.notes}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Monthly checklist */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Monthly Compliance Checklist</h2>
        <div className="space-y-3">
          {CHECKLIST.map(c => (
            <div key={c.day} className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2">
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{c.day}</p>
              </div>
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {c.items.map(item => (
                  <li key={item} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900">
                    <span className="text-gray-400 text-base">☐</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Penalties summary */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">What happens if you miss a deadline?</h2>
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-4 space-y-2">
          <p className="text-sm font-semibold text-red-700 dark:text-red-300">Penalties compound quickly:</p>
          <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>• PAYE late: 25% of unpaid tax (minimum KES 10,000) + 1% per month interest</li>
            <li>• 3 months late on KES 100,000 PAYE = KES 25,000 penalty + KES 3,000 interest = <strong>KES 28,000 extra</strong></li>
            <li>• Late filing (even if nil): KES 2,000/month (individuals) or KES 5,000/month (companies)</li>
            <li>• KRA can issue agency notices to clients and banks to recover unpaid taxes</li>
          </ul>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Best practice:</strong> File returns on iTax even when you have nothing to remit (nil returns).
          This avoids late filing penalties and keeps your tax compliance status clean.
        </p>
      </section>
    </LearningLayout>
  )
}
