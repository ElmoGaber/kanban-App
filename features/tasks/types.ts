export type ColumnId = 'backlog' | 'in_progress' | 'review' | 'done'
export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  column: ColumnId
  priority: Priority
  createdAt: string
}

export interface TaskFormValues {
  title: string
  description: string
  column: ColumnId
  priority: Priority
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  hasNextPage: boolean
}

export interface ColumnMeta {
  id: ColumnId
  label: string
  color: string
  accent: string
}
