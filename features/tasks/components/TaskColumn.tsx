'use client'

import { useEffect, useRef } from 'react'
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Skeleton,
  Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useColumnTasks } from '../hooks/useColumnTasks'
import { useBoardStore } from '@/store/boardStore'
import TaskCard from './TaskCard'
import type { ColumnMeta } from '@/features/tasks/types'

interface TaskColumnProps {
  column: ColumnMeta
}

export default function TaskColumn({ column }: TaskColumnProps) {
  const search = useBoardStore((s) => s.search)
  const openCreateModal = useBoardStore((s) => s.openCreateModal)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useColumnTasks(column.id, search)

  const tasks = data?.pages.flatMap((p) => p.tasks) ?? []
  const totalCount = data?.pages[0]?.total ?? 0
  const taskIds = tasks.map((t) => t.id)

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', columnId: column.id },
  })

  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1, rootMargin: '40px' }
    )

    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: { xs: 280, sm: 300, lg: 320 },
        minWidth: { xs: 280, sm: 300, lg: 320 },
        maxHeight: 'calc(100vh - 120px)',
        borderRadius: '14px',
        bgcolor: '#0d1b2a',
        border: '1px solid',
        borderColor: isOver
          ? `${column.color}60`
          : 'rgba(255,255,255,0.05)',
        boxShadow: isOver
          ? `0 0 0 1px ${column.color}40, 0 8px 32px rgba(0,0,0,0.4)`
          : '0 2px 12px rgba(0,0,0,0.25)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: column.color,
              boxShadow: `0 0 8px ${column.color}80`,
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'monospace',
            }}
          >
            {column.label}
          </Typography>
        </Box>

        <Box
          sx={{
            px: 1.25,
            py: 0.25,
            borderRadius: '6px',
            bgcolor: `${column.color}18`,
            border: `1px solid ${column.color}30`,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: column.color,
              fontFamily: 'monospace',
              lineHeight: 1.4,
            }}
          >
            {isLoading ? '–' : totalCount}
          </Typography>
        </Box>
      </Box>

      <Box
        ref={setNodeRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2,
          py: 2,
          bgcolor: isOver ? `${column.color}06` : 'transparent',
          transition: 'background-color 0.15s',
          '&::-webkit-scrollbar': { width: 3 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 2,
          },
        }}
      >
        {isLoading && (
          <Box>
            {[1, 2, 3].map((n) => (
              <Skeleton
                key={n}
                variant="rounded"
                height={88}
                sx={{ mb: 1.5, borderRadius: '10px', bgcolor: 'rgba(255,255,255,0.04)' }}
              />
            ))}
          </Box>
        )}

        {isError && (
          <Alert
            severity="error"
            sx={{
              bgcolor: 'rgba(248,113,113,0.1)',
              color: '#f87171',
              border: '1px solid rgba(248,113,113,0.2)',
              borderRadius: '10px',
              '& .MuiAlert-icon': { color: '#f87171' },
            }}
          >
            Failed to load tasks
          </Alert>
        )}

        {!isLoading && !isError && (
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        )}

        {!isLoading && tasks.length === 0 && !isError && (
          <Box
            sx={{
              py: 5,
              textAlign: 'center',
              border: '1px dashed rgba(255,255,255,0.08)',
              borderRadius: '10px',
            }}
          >
            <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.78rem' }}>
              {search ? 'No matches' : 'Empty'}
            </Typography>
          </Box>
        )}

        <Box ref={sentinelRef} sx={{ height: 1 }} />

        {isFetchingNextPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={18} sx={{ color: column.color }} />
          </Box>
        )}
      </Box>

      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderTop: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0,
        }}
      >
        <Button
          fullWidth
          size="small"
          startIcon={<AddIcon sx={{ fontSize: '15px !important' }} />}
          onClick={() => openCreateModal(column.id)}
          sx={{
            color: 'rgba(255,255,255,0.3)',
            fontSize: '0.76rem',
            fontWeight: 600,
            justifyContent: 'flex-start',
            pl: 1,
            borderRadius: '7px',
            textTransform: 'none',
            '&:hover': {
              color: column.color,
              bgcolor: `${column.color}10`,
            },
            transition: 'color 0.15s, background-color 0.15s',
          }}
        >
          Add task
        </Button>
      </Box>
    </Box>
  )
}
