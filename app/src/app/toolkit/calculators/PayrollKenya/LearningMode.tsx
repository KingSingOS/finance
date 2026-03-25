import { useState } from 'react'
import { LearningLayout } from '../../layouts/LearningLayout'
import { HelpTooltip } from '../../components/Tooltip'
import { formatKES, formatPct } from '../../utils/format'
import { calculatePayroll } from './shared'

const PAYE_BANDS = [
  { band: '1', monthly: 'KES 0 – 24,000', annual: 'KES 0 – 288,000', rate: '10%' },
  { band: '2', monthly: 'KES 24,001 – 32,333', annual: 'KES 288,001 – 388,000', rate: '25%' },
  { band: '3', monthly: 'KES 32,334 – 500,000', annual: 'KES 388,001 – 6,000,000', rate: '30%' },
  { band: '4', monthly: 'KES 500,001 – 800,000', annual: 'KES 6,000,001 – 9,600,000', rate: '32.5%' },
  { band: '5', monthly: 'KES 800,001+', annual: 'KES 9,600,001+', rate: '35%' },
]

const NHIF_BRACKETS = [
  { range: 'Up to 5,999', contribution: '150' },
  { range: '6,000 – 7,999', contribution: '300' },
  { range: '8,000 – 11,999', contribution: '400' },
  { range: '12,000 – 14,999', contribution: '500' },
  { range: '15,000 – 19,999', contribution: '600' },
  { range: '20,000 – 24,999', contribution: '750' },
  { range: '25,000 – 29,999', contribution: '850' },
  { range: '30,000 – 34,999', contribution: '900' },
  { range: '35,000 – 39,999', contribution: '950' },
  { range: '40,000 – 44,999', contribution: '1,000' },
  { range: '45,000 – 49,999', contribution: '1,100' },
  { range: '50,000 – 59,999', contribution: '1,200' },
  { range: '60,000 – 69,999', contribution: '1,300' },
  { range: '70,000 – 79,999', contribution: '1,400' },
  { range: '80,000 – 89,999', contribution: '1,500' },
  { range: '90,000 – 99,999', contribution: '1,600' },
  { range: '100,000+', contribution: '1,700' },
]

const EXAMPLE_SALARY = 100_000

export default function PayrollKenyaLearning() {
  const [salary, setSalary] = useState(EXAMPLE_SALARY)
  const r = calculatePayroll({ grossSalary: salary })

  return (
    <LearningLayout
      title="Kenya Payroll & Statutory Deductions"
      description="Understanding PAYE, NHIF, NSSF, and Housing Levy (2024)"
    >
      {/* What is payroll? */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Why statutory deductions matter</h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          Every Kenyan employer is legally required to deduct and remit four statutory contributions
          from an employee's gross salary each month. Failure to remit on time attracts penalties of
          5% per month on the outstanding amount.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'PAYE', desc: 'Pay As You Earn — income tax', color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700' },
            { name: 'NHIF', desc: 'National Hospital Insurance Fund', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' },
            { name: 'NSSF', desc: 'National Social Security Fund', color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700' },
            { name: 'Housing Levy', desc: 'Affordable Housing Fund (1.5%)', color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700' },
          ].map(d => (
            <div key={d.name} className={`rounded-lg border p-3 ${d.color}`}>
              <p className="font-bold text-sm text-gray-900 dark:text-white">{d.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PAYE */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          PAYE — Progressive Tax Bands (2024)
          <HelpTooltip content="Kenya uses a progressive system: each band is taxed at its own rate, not the highest band's rate." />
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          PAYE uses a <strong>progressive tax system</strong> — only the portion of income
          in each band is taxed at that band's rate. Personal relief of KES 2,400/month
          is then subtracted from the calculated tax.
        </p>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Band</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Monthly Range</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Annual Range</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {PAYE_BANDS.map(b => (
                <tr key={b.band} className="bg-white dark:bg-gray-900">
                  <td className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">{b.band}</td>
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{b.monthly}</td>
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{b.annual}</td>
                  <td className="px-3 py-2 text-right font-bold text-blue-700 dark:text-blue-300">{b.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-3 text-sm text-blue-800 dark:text-blue-200">
          <strong>Personal Relief:</strong> KES 2,400/month (KES 28,800/year) subtracted from calculated PAYE.
          This means the first ~KES 24,000 of gross salary is effectively tax-free.
        </div>
      </section>

      {/* NHIF */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">NHIF — Fixed Bracket Contributions</h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          NHIF uses a fixed-amount lookup table based on gross salary range.
          Unlike PAYE, it's not a percentage — you pay a flat amount per bracket.
        </p>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Gross Salary Range (KES)</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Monthly Contribution (KES)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {NHIF_BRACKETS.map(b => (
                <tr key={b.range} className="bg-white dark:bg-gray-900">
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{b.range}</td>
                  <td className="px-3 py-2 text-right font-medium text-gray-700 dark:text-gray-300">{b.contribution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* NSSF */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">NSSF — Two-Tier Pension (2024)</h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          Under the NSSF Act 2013, contributions are calculated in two tiers at 6% each.
          Both employee and employer contribute equally.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/10 p-4 space-y-1">
            <p className="font-semibold text-purple-700 dark:text-purple-300 text-sm">Tier I</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">First KES 7,000 of gross salary</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">6% = max KES 420/month</p>
          </div>
          <div className="rounded-lg border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/10 p-4 space-y-1">
            <p className="font-semibold text-purple-700 dark:text-purple-300 text-sm">Tier II</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">KES 7,001 – 36,000 of gross salary</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">6% = max KES 1,740/month</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Maximum combined employee NSSF = KES 2,160/month. Employer matches the same amount.
          Salaries above KES 36,000 pay the same fixed maximum.
        </p>
      </section>

      {/* Housing Levy */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Housing Levy — 1.5% + 1.5%</h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          Introduced in 2023, the Affordable Housing Levy is <strong>1.5% of gross salary</strong> from
          the employee, matched by <strong>1.5% from the employer</strong>. Unlike NSSF, there is no
          upper limit — it applies to the full gross salary.
        </p>
      </section>

      {/* Interactive worked example */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Worked Example — Interactive</h2>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Gross Salary (KES)</label>
          <input
            type="number"
            value={salary}
            onChange={e => setSalary(parseFloat(e.target.value) || 0)}
            className="w-36 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Item</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Amount</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">% of Gross</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
              <tr>
                <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">Gross Salary</td>
                <td className="px-4 py-2.5 text-right font-medium text-gray-900 dark:text-white">{formatKES(r.grossSalary)}</td>
                <td className="px-4 py-2.5 text-right text-gray-500">100.0%</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400 pl-6">− PAYE</td>
                <td className="px-4 py-2.5 text-right text-red-600 dark:text-red-400">({formatKES(r.paye)})</td>
                <td className="px-4 py-2.5 text-right text-gray-500">{formatPct(r.paye / salary * 100)}</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400 pl-6">− NHIF</td>
                <td className="px-4 py-2.5 text-right text-red-600 dark:text-red-400">({formatKES(r.nhif)})</td>
                <td className="px-4 py-2.5 text-right text-gray-500">{formatPct(r.nhif / salary * 100)}</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400 pl-6">− NSSF</td>
                <td className="px-4 py-2.5 text-right text-red-600 dark:text-red-400">({formatKES(r.nssf)})</td>
                <td className="px-4 py-2.5 text-right text-gray-500">{formatPct(r.nssf / salary * 100)}</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400 pl-6">− Housing Levy</td>
                <td className="px-4 py-2.5 text-right text-red-600 dark:text-red-400">({formatKES(r.housingLevy)})</td>
                <td className="px-4 py-2.5 text-right text-gray-500">{formatPct(r.housingLevy / salary * 100)}</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800 font-bold border-t-2 border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2.5 text-gray-900 dark:text-white">Total Deductions</td>
                <td className="px-4 py-2.5 text-right text-red-700 dark:text-red-300">{formatKES(r.totalDeductions)}</td>
                <td className="px-4 py-2.5 text-right text-red-700 dark:text-red-300">{formatPct(r.totalDeductions / salary * 100)}</td>
              </tr>
              <tr className="bg-green-50 dark:bg-green-900/10 font-bold">
                <td className="px-4 py-2.5 text-green-700 dark:text-green-300">NET PAY</td>
                <td className="px-4 py-2.5 text-right text-green-700 dark:text-green-300 text-base">{formatKES(r.netPay)}</td>
                <td className="px-4 py-2.5 text-right text-green-700 dark:text-green-300">{formatPct(r.takeHomePercentage)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 text-xs text-gray-500 dark:text-gray-400">
          <strong>Employer adds:</strong> NSSF {formatKES(r.employerNSSF)} + Housing Levy {formatKES(r.employerHousingLevy)} = <strong>{formatKES(r.totalEmployerCost)}</strong> total cost to hire this employee.
        </div>
      </section>

      {/* Key insights */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Key Compliance Points</h2>
        <div className="space-y-2">
          {[
            'All 4 deductions must be remitted by the 9th of the following month.',
            'PAYE, NHIF, and NSSF use employee-side deductions only; employer adds NSSF and Housing Levy on top.',
            'Late remittance penalty: 5% of the outstanding amount per month for PAYE; KES 2,000 or 5% for NHIF; 5% + 1% interest for NSSF.',
            'Employees earning below KES 24,000/month pay minimal PAYE due to personal relief covering most of the Band 1 tax.',
            'The Housing Levy is relatively new (2023) and applies to all employees regardless of salary level.',
          ].map((point, i) => (
            <div key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-blue-500 font-bold shrink-0">{i + 1}.</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </section>
    </LearningLayout>
  )
}
