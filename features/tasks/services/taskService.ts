import axios from 'axios'
import { API_BASE, PAGE_SIZE } from '@/lib/constants'
import type { Task, TaskFormValues, ColumnId } from '../types'

const http = axios.create({ baseURL: API_BASE })

interface FetchColumnTasksParams {
  column: ColumnId
  page: number
  search: string
}

export interface ColumnTasksPage {
  tasks: Task[]
  total: number
  page: number
  hasNextPage: boolean
}

export async function fetchColumnTasks({
  column,
  page,
  search,
}: FetchColumnTasksParams): Promise<ColumnTasksPage> {
  const params = new URLSearchParams({
    column,
    _page: String(page),
    _limit: String(PAGE_SIZE),
    _sort: 'createdAt',
    _order: 'desc',
  })

  if (search.trim()) {
    params.set('q', search.trim())
  }

  const response = await http.get<Task[]>(`/tasks?${params}`)
  const total = parseInt(response.headers['x-total-count'] ?? '0', 10)

  return {
    tasks: response.data,
    total,
    page,
    hasNextPage: page * PAGE_SIZE < total,
  }
}

export async function createTask(values: TaskFormValues): Promise<Task> {
  const payload: Omit<Task, 'id'> = {
    ...values,
    createdAt: new Date().toISOString(),
  }
  const { data } = await http.post<Task>('/tasks', {
    ...payload,
    id: `t${Date.now()}`,
  })
  return data
}

export async function updateTask(id: string, changes: Partial<TaskFormValues>): Promise<Task> {
  const { data } = await http.patch<Task>(`/tasks/${id}`, changes)
  return data
}

export async function deleteTask(id: string): Promise<void> {
  await http.delete(`/tasks/${id}`)
}
