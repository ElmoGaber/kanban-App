'use client'

import { useState } from 'react'
import { Box } from '@mui/material'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  defaultDropAnimationSideEffects,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { COLUMNS } from '@/lib/constants'
import { useBoardStore } from '@/store/boardStore'
import { useMoveTask } from '../hooks/useTaskMutations'
import TaskColumn from './TaskColumn'
import TaskCard from './TaskCard'
import type { Task, ColumnId } from '../types'

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: '0.35' } },
  }),
}

export default function KanbanBoard() {
  const { mutate: moveTask } = useMoveTask()
  const setDraggingTaskId = useBoardStore((s) => s.setDraggingTaskId)

  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  )

  function onDragStart({ active }: DragStartEvent) {
    const task = active.data.current?.task as Task | undefined
    setActiveTask(task ?? null)
    setDraggingTaskId(active.id as string)
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    setActiveTask(null)
    setDraggingTaskId(null)

    if (!over) return

    const draggedTask = active.data.current?.task as Task | undefined
    if (!draggedTask) return

    let targetColumn: ColumnId | null = null

    if (over.data.current?.type === 'column') {
      targetColumn = over.data.current.columnId as ColumnId
    } else if (over.data.current?.type === 'task') {
      targetColumn = (over.data.current.task as Task).column
    } else if (COLUMNS.some((c) => c.id === over.id)) {
      targetColumn = over.id as ColumnId
    }

    if (!targetColumn || draggedTask.column === targetColumn) return

    moveTask({ id: draggedTask.id, column: targetColumn })
  }

  function onDragCancel() {
    setActiveTask(null)
    setDraggingTaskId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2.5,
          overflowX: 'auto',
          pb: 2,
          px: 0.5,
          '&::-webkit-scrollbar': { height: 5 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 3,
          },
        }}
      >
        {COLUMNS.map((col) => (
          <TaskColumn key={col.id} column={col} />
        ))}
      </Box>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask && (
          <Box sx={{ rotate: '2deg', scale: '1.02', cursor: 'grabbing' }}>
            <TaskCard task={activeTask} />
          </Box>
        )}
      </DragOverlay>
    </DndContext>
  )
}
