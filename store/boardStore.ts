import { create } from 'zustand'
import type { Task, ColumnId } from '@/features/tasks/types'

type ModalMode = 'create' | 'edit'

interface BoardState {
  search: string
  setSearch: (query: string) => void

  modal: {
    open: boolean
    mode: ModalMode
    task: Task | null
    defaultColumn: ColumnId
  }
  openCreateModal: (column?: ColumnId) => void
  openEditModal: (task: Task) => void
  closeModal: () => void

  draggingTaskId: string | null
  setDraggingTaskId: (id: string | null) => void
}

const defaultModal = {
  open: false,
  mode: 'create' as ModalMode,
  task: null,
  defaultColumn: 'backlog' as ColumnId,
}

export const useBoardStore = create<BoardState>((set) => ({
  search: '',
  setSearch: (query) => set({ search: query }),

  modal: defaultModal,
  openCreateModal: (column = 'backlog') =>
    set({ modal: { open: true, mode: 'create', task: null, defaultColumn: column } }),
  openEditModal: (task) =>
    set({ modal: { open: true, mode: 'edit', task, defaultColumn: task.column } }),
  closeModal: () => set({ modal: defaultModal }),

  draggingTaskId: null,
  setDraggingTaskId: (id) => set({ draggingTaskId: id }),
}))
