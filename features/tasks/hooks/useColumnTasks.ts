import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchColumnTasks } from '../services/taskService'
import type { ColumnId } from '../types'

export function useColumnTasks(column: ColumnId, search: string) {
  return useInfiniteQuery({
    queryKey: ['tasks', column, search],
    queryFn: ({ pageParam }) =>
      fetchColumnTasks({ column, page: pageParam as number, search }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 2,
  })
}
