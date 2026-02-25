import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query'
import {
  createTask,
  updateTask,
  deleteTask,
  type ColumnTasksPage,
} from '../services/taskService'
import type { Task, TaskFormValues, ColumnId } from '../types'

type TasksInfiniteData = InfiniteData<ColumnTasksPage>

function invalidateColumn(qc: ReturnType<typeof useQueryClient>, column: ColumnId, search = '') {
  qc.invalidateQueries({ queryKey: ['tasks', column, search] })
}

function invalidateAllColumns(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ['tasks'] })
}

export function useCreateTask() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createTask,
    onSuccess: (task) => {
      invalidateColumn(qc, task.column)
    },
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: Partial<TaskFormValues> }) =>
      updateTask(id, changes),
    onSuccess: () => {
      invalidateAllColumns(qc)
    },
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      invalidateAllColumns(qc)
    },
  })
}

export function useMoveTask() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, column }: { id: string; column: ColumnId }) =>
      updateTask(id, { column }),

    onMutate: async ({ id, column: targetColumn }) => {
      await qc.cancelQueries({ queryKey: ['tasks'] })

      const allQueryData = new Map<string, TasksInfiniteData>()
      let movedTask: Task | undefined

      qc.getQueriesData<TasksInfiniteData>({ queryKey: ['tasks'] }).forEach(([key, data]) => {
        if (!data) return
        const cacheKey = JSON.stringify(key)
        allQueryData.set(cacheKey, data)

        const updated: TasksInfiniteData = {
          ...data,
          pages: data.pages.map((page) => {
            const found = page.tasks.find((t) => t.id === id)
            if (found) movedTask = { ...found, column: targetColumn }
            return {
              ...page,
              tasks: page.tasks.filter((t) => t.id !== id),
              total: found ? page.total - 1 : page.total,
            }
          }),
        }
        qc.setQueryData(key, updated)
      })

      return { allQueryData, movedTask }
    },

    onError: (_err, _vars, context) => {
      if (!context) return
      context.allQueryData.forEach((data, cacheKey) => {
        qc.setQueryData(JSON.parse(cacheKey), data)
      })
    },

    onSettled: () => {
      invalidateAllColumns(qc)
    },
  })
}
