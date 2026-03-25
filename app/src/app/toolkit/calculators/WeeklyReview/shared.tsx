/** Weekly Review — plan vs actual weekly check-in */

export type ActionStatus = 'Done' | 'In Progress' | 'Blocked' | 'Not Started'
export type Priority = 'High' | 'Medium' | 'Low'

export interface WeeklyKPI {
  id: string
  name: string
  target: number
  actual: number
  unit: string
}

export interface ActionItem {
  id: string
  text: string
  owner: string
  priority: Priority
  status: ActionStatus
}

export interface WeeklyReviewInputs {
  weekLabel: string
  wins: string
  challenges: string
  kpis: WeeklyKPI[]
  lastWeekActions: ActionItem[]
  thisWeekPriorities: ActionItem[]
}

export interface WeeklyReviewResult {
  kpisOnTrack: number
  kpisTotal: number
  kpiScore: number           // % on track
  actionsCompleted: number
  actionsTotal: number
  completionRate: number     // % done
  overallScore: number       // 0–100 composite
  healthLabel: 'Excellent' | 'Good' | 'Fair' | 'Poor'
}

export function calculateWeeklyReview(inputs: WeeklyReviewInputs): WeeklyReviewResult {
  const kpisOnTrack = inputs.kpis.filter(k => k.target > 0 ? k.actual / k.target >= 0.9 : true).length
  const kpisTotal = inputs.kpis.length
  const kpiScore = kpisTotal > 0 ? (kpisOnTrack / kpisTotal) * 100 : 100

  const actionsCompleted = inputs.lastWeekActions.filter(a => a.status === 'Done').length
  const actionsTotal = inputs.lastWeekActions.length
  const completionRate = actionsTotal > 0 ? (actionsCompleted / actionsTotal) * 100 : 100

  const overallScore = Math.round((kpiScore * 0.6) + (completionRate * 0.4))
  const healthLabel =
    overallScore >= 80 ? 'Excellent' :
    overallScore >= 60 ? 'Good' :
    overallScore >= 40 ? 'Fair' : 'Poor'

  return { kpisOnTrack, kpisTotal, kpiScore, actionsCompleted, actionsTotal, completionRate, overallScore, healthLabel }
}

export const DEFAULT_INPUTS: WeeklyReviewInputs = {
  weekLabel: 'Week of ' + new Date().toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' }),
  wins: 'Closed 2 new enterprise deals. Launched product update on schedule.',
  challenges: 'Customer support backlog grew to 3 days. Marketing spend over budget.',
  kpis: [
    { id: '1', name: 'Revenue',        target: 250_000, actual: 271_000, unit: 'KES' },
    { id: '2', name: 'New Customers',  target: 10,      actual: 8,       unit: '' },
    { id: '3', name: 'Support Tickets Resolved', target: 50, actual: 38, unit: '' },
    { id: '4', name: 'Cash Balance',   target: 1_000_000, actual: 1_120_000, unit: 'KES' },
    { id: '5', name: 'Team NPS',       target: 8,       actual: 7.5,     unit: '/10' },
  ],
  lastWeekActions: [
    { id: '1', text: 'Send proposal to Safaricom',  owner: 'Sarah', priority: 'High',   status: 'Done' },
    { id: '2', text: 'Fix payment gateway timeout', owner: 'Dev',   priority: 'High',   status: 'Done' },
    { id: '3', text: 'Hire customer support rep',   owner: 'HR',    priority: 'Medium', status: 'In Progress' },
    { id: '4', text: 'Update financial model',      owner: 'James', priority: 'Medium', status: 'Done' },
    { id: '5', text: 'Review supplier contracts',   owner: 'James', priority: 'Low',    status: 'Not Started' },
  ],
  thisWeekPriorities: [
    { id: '1', text: 'Close Safaricom deal',          owner: 'Sarah', priority: 'High',   status: 'Not Started' },
    { id: '2', text: 'Resolve support backlog',       owner: 'Ops',   priority: 'High',   status: 'Not Started' },
    { id: '3', text: 'Complete hiring for CS role',   owner: 'HR',    priority: 'Medium', status: 'Not Started' },
    { id: '4', text: 'Prepare investor update',       owner: 'James', priority: 'Medium', status: 'Not Started' },
    { id: '5', text: 'Negotiate supplier terms',      owner: 'James', priority: 'Low',    status: 'Not Started' },
  ],
}
