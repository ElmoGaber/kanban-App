import type { ColumnMeta } from '@/features/tasks/types'

export const API_BASE = 'http://localhost:4000'

export const PAGE_SIZE = 8

export const COLUMNS: ColumnMeta[] = [
  { id: 'backlog',     label: 'Backlog',      color: '#94a3b8', accent: '#64748b' },
  { id: 'in_progress', label: 'In Progress',  color: '#f59e0b', accent: '#d97706' },
  { id: 'review',      label: 'In Review',    color: '#a78bfa', accent: '#7c3aed' },
  { id: 'done',        label: 'Done',         color: '#34d399', accent: '#059669' },
]

export const PRIORITY_META = {
  low:    { label: 'Low',    color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  high:   { label: 'High',   color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
} as const
