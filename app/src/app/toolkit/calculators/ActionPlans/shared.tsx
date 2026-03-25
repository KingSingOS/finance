/** Action Plans — prioritised action tracking */

export type ActionStatus = 'To Do' | 'In Progress' | 'Done' | 'Blocked'
export type ActionPriority = 'Critical' | 'High' | 'Medium' | 'Low'
export type ActionCategory = 'Revenue' | 'Operations' | 'Finance' | 'HR' | 'Product' | 'Marketing' | 'Other'

export interface Action {
  id: string
  title: string
  description: string
  owner: string
  priority: ActionPriority
  category: ActionCategory
  status: ActionStatus
  dueDate: string   // YYYY-MM-DD
}

export interface ActionSummary {
  actions: Action[]
  total: number
  done: number
  inProgress: number
  toDo: number
  blocked: number
  completionRate: number
  overdue: number
  dueThisWeek: number
  byPriority: Record<ActionPriority, { total: number; done: number }>
  byCategory: Record<ActionCategory, number>
  criticalOpen: number
}

function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function calculateActionSummary(actions: Action[]): ActionSummary {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekAhead = new Date(today)
  weekAhead.setDate(weekAhead.getDate() + 7)

  const done       = actions.filter(a => a.status === 'Done').length
  const inProgress = actions.filter(a => a.status === 'In Progress').length
  const toDo       = actions.filter(a => a.status === 'To Do').length
  const blocked    = actions.filter(a => a.status === 'Blocked').length
  const total      = actions.length
  const completionRate = total > 0 ? (done / total) * 100 : 0

  const openStatuses: ActionStatus[] = ['To Do', 'In Progress', 'Blocked']
  const overdue = actions.filter(a =>
    openStatuses.includes(a.status) && a.dueDate && parseDate(a.dueDate) < today
  ).length
  const dueThisWeek = actions.filter(a =>
    openStatuses.includes(a.status) && a.dueDate &&
    parseDate(a.dueDate) >= today && parseDate(a.dueDate) <= weekAhead
  ).length

  const byPriority: ActionSummary['byPriority'] = {
    Critical: { total: 0, done: 0 },
    High:     { total: 0, done: 0 },
    Medium:   { total: 0, done: 0 },
    Low:      { total: 0, done: 0 },
  }
  for (const a of actions) {
    byPriority[a.priority].total++
    if (a.status === 'Done') byPriority[a.priority].done++
  }

  const byCategory: ActionSummary['byCategory'] = {
    Revenue: 0, Operations: 0, Finance: 0, HR: 0, Product: 0, Marketing: 0, Other: 0,
  }
  for (const a of actions) byCategory[a.category]++

  const criticalOpen = actions.filter(a => a.priority === 'Critical' && a.status !== 'Done').length

  return { actions, total, done, inProgress, toDo, blocked, completionRate, overdue, dueThisWeek, byPriority, byCategory, criticalOpen }
}

const d = (offset: number) => {
  const dt = new Date()
  dt.setDate(dt.getDate() + offset)
  return dt.toISOString().slice(0, 10)
}

export const DEFAULT_ACTIONS: Action[] = [
  { id: '1',  title: 'Close enterprise pipeline deal',   description: 'Follow up with decision maker and send final proposal', owner: 'Sarah',  priority: 'Critical', category: 'Revenue',    status: 'In Progress', dueDate: d(2) },
  { id: '2',  title: 'Fix payment gateway timeout',      description: 'Bug causing 3% checkout failures',                      owner: 'Dev',    priority: 'Critical', category: 'Product',    status: 'Done',        dueDate: d(-1) },
  { id: '3',  title: 'Hire customer support rep',        description: 'Post role, shortlist, interview, offer',                 owner: 'HR',     priority: 'High',    category: 'HR',         status: 'In Progress', dueDate: d(14) },
  { id: '4',  title: 'Negotiate supplier contracts',     description: 'Renew 3 key supplier contracts before expiry',           owner: 'James',  priority: 'High',    category: 'Operations', status: 'To Do',       dueDate: d(7) },
  { id: '5',  title: 'Launch Q3 marketing campaign',     description: 'Finalize creative, set budgets, activate channels',      owner: 'Marketing', priority: 'High', category: 'Marketing',  status: 'To Do',       dueDate: d(10) },
  { id: '6',  title: 'Update financial model (FY25)',    description: 'Refresh assumptions, update projections',                 owner: 'James',  priority: 'Medium',  category: 'Finance',    status: 'Done',        dueDate: d(-3) },
  { id: '7',  title: 'Implement expense policy',         description: 'Draft, approve, and communicate new expense policy',     owner: 'James',  priority: 'Medium',  category: 'Finance',    status: 'To Do',       dueDate: d(21) },
  { id: '8',  title: 'User onboarding flow redesign',    description: 'Reduce time-to-value from 5 days to 1 day',              owner: 'Product', priority: 'Medium', category: 'Product',    status: 'Blocked',     dueDate: d(30) },
  { id: '9',  title: 'NHIF/NSSF compliance review',     description: 'Verify all remittances are up to date',                  owner: 'HR',     priority: 'Medium',  category: 'HR',         status: 'To Do',       dueDate: d(5) },
  { id: '10', title: 'Set up Google Analytics 4',       description: 'Migrate from UA to GA4 before deadline',                 owner: 'Marketing', priority: 'Low',  category: 'Marketing',  status: 'To Do',       dueDate: d(45) },
]
