'use client'

import { memo } from 'react'
import { Box, Typography, Chip, IconButton } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PRIORITY_META } from '@/lib/constants'
import { useBoardStore } from '@/store/boardStore'
import { useDeleteTask } from '../hooks/useTaskMutations'
import type { Task } from '../types'

interface TaskCardProps {
  task: Task
}

function TaskCard({ task }: TaskCardProps) {
  const openEditModal = useBoardStore((s) => s.openEditModal)
  const { mutate: remove, isPending: isRemoving } = useDeleteTask()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: 'task', task },
  })

  const priority = PRIORITY_META[task.priority]

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      }}
      sx={{
        position: 'relative',
        bgcolor: '#16213a',
        border: '1px solid',
        borderColor: 'rgba(255,255,255,0.06)',
        borderRadius: '10px',
        p: 2,
        mb: 1.5,
        cursor: isDragging ? 'grabbing' : 'default',
        '&:hover': {
          borderColor: 'rgba(255,255,255,0.12)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          '& .card-actions': { opacity: 1 },
          '& .drag-handle': { opacity: 1 },
        },
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
    >
      <Box
        className="drag-handle"
        {...attributes}
        {...listeners}
        onPointerDown={(e) => {
          e.currentTarget.style.cursor = 'grabbing'
          listeners?.onPointerDown?.(e)
        }}
        sx={{
          position: 'absolute',
          left: 6,
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0,
          cursor: 'grab',
          color: 'rgba(255,255,255,0.3)',
          display: 'flex',
          transition: 'opacity 0.15s',
          zIndex: 1,
        }}
      >
        <DragIndicatorIcon sx={{ fontSize: 16 }} />
      </Box>

      <Box sx={{ pl: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
          <Chip
            label={priority.label}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              bgcolor: priority.bg,
              color: priority.color,
              borderRadius: '5px',
              fontFamily: 'monospace',
            }}
          />

          <Box
            className="card-actions"
            sx={{ display: 'flex', gap: 0.25, opacity: 0, transition: 'opacity 0.15s' }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <IconButton
              size="small"
              onClick={() => openEditModal(task)}
              sx={{
                width: 26,
                height: 26,
                color: 'rgba(255,255,255,0.4)',
                '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.08)' },
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 14 }} />
            </IconButton>
            <IconButton
              size="small"
              disabled={isRemoving}
              onClick={() => remove(task.id)}
              sx={{
                width: 26,
                height: 26,
                color: 'rgba(255,255,255,0.4)',
                '&:hover': { color: '#f87171', bgcolor: 'rgba(248,113,113,0.1)' },
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: 'rgba(255,255,255,0.9)',
            fontSize: '0.84rem',
            lineHeight: 1.45,
            mb: task.description ? 0.75 : 0,
          }}
        >
          {task.title}
        </Typography>

        {task.description && (
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255,255,255,0.38)',
              fontSize: '0.73rem',
              lineHeight: 1.5,
              display: 'block',
            }}
          >
            {task.description.length > 90
              ? `${task.description.slice(0, 90)}…`
              : task.description}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default memo(TaskCard)
