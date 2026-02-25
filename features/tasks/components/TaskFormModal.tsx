'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Typography,
  IconButton,
  FormHelperText,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useBoardStore } from '@/store/boardStore'
import { useCreateTask, useUpdateTask } from '../hooks/useTaskMutations'
import { COLUMNS, PRIORITY_META } from '@/lib/constants'
import type { ColumnId, Priority, TaskFormValues } from '../types'

const PRIORITIES: Priority[] = ['low', 'medium', 'high']
const COLUMN_IDS: ColumnId[] = ['backlog', 'in_progress', 'review', 'done']

type FormErrors = Partial<Record<keyof TaskFormValues, string>>

export default function TaskFormModal() {
  const { modal, closeModal } = useBoardStore()
  const { open, mode, task, defaultColumn } = modal

  const { mutate: create, isPending: isCreating } = useCreateTask()
  const { mutate: update, isPending: isUpdating } = useUpdateTask()

  const isSubmitting = isCreating || isUpdating

  const [values, setValues] = useState<TaskFormValues>({
    title: '',
    description: '',
    column: defaultColumn,
    priority: 'medium',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (!open) return
    setErrors({})
    if (mode === 'edit' && task) {
      setValues({
        title: task.title,
        description: task.description,
        column: task.column,
        priority: task.priority,
      })
    } else {
      setValues({ title: '', description: '', column: defaultColumn, priority: 'medium' })
    }
  }, [open, mode, task, defaultColumn])

  function validate(): boolean {
    const next: FormErrors = {}
    if (!values.title.trim()) next.title = 'Title is required'
    else if (values.title.length > 120) next.title = 'Title must be under 120 characters'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit() {
    if (!validate()) return

    if (mode === 'edit' && task) {
      update({ id: task.id, changes: values }, { onSuccess: closeModal })
    } else {
      create(values, { onSuccess: closeModal })
    }
  }

  const columnMeta = COLUMNS.find((c) => c.id === values.column)

  return (
    <Dialog
      open={open}
      onClose={closeModal}
      maxWidth="sm"
      fullWidth
      onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handleSubmit()}
      PaperProps={{
        sx: {
          bgcolor: '#0d1b2a',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '-0.01em',
            }}
          >
            {mode === 'create' ? 'New Task' : 'Edit Task'}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', mt: 0.25 }}>
            {mode === 'create' ? 'Ctrl+Enter to submit' : 'Ctrl+Enter to save changes'}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={closeModal}
          sx={{
            color: 'rgba(255,255,255,0.3)',
            '&:hover': { color: 'rgba(255,255,255,0.7)', bgcolor: 'rgba(255,255,255,0.06)' },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 1 }}>
        <TextField
          label="Title"
          placeholder="e.g. Implement authentication flow"
          value={values.title}
          onChange={(e) => {
            setValues((v) => ({ ...v, title: e.target.value }))
            if (errors.title) setErrors((err) => ({ ...err, title: undefined }))
          }}
          error={!!errors.title}
          helperText={errors.title}
          fullWidth
          autoFocus
          inputProps={{ maxLength: 120 }}
          sx={{ mb: 2.5, ...inputStyles }}
        />

        <TextField
          label="Description"
          placeholder="Add context or acceptance criteria…"
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2.5, ...inputStyles }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl fullWidth sx={selectStyles}>
            <InputLabel>Column</InputLabel>
            <Select
              value={values.column}
              label="Column"
              onChange={(e) => setValues((v) => ({ ...v, column: e.target.value as ColumnId }))}
            >
              {COLUMN_IDS.map((id) => {
                const col = COLUMNS.find((c) => c.id === id)!
                return (
                  <MenuItem key={id} value={id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          bgcolor: col.color,
                          flexShrink: 0,
                        }}
                      />
                      {col.label}
                    </Box>
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={selectStyles}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={values.priority}
              label="Priority"
              onChange={(e) => setValues((v) => ({ ...v, priority: e.target.value as Priority }))}
            >
              {PRIORITIES.map((p) => {
                const meta = PRIORITY_META[p]
                return (
                  <MenuItem key={p} value={p}>
                    <Typography
                      sx={{
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: meta.color,
                        fontFamily: 'monospace',
                      }}
                    >
                      {meta.label}
                    </Typography>
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
          {columnMeta && (
            <Box
              sx={{
                px: 1.25,
                py: 0.4,
                borderRadius: '6px',
                bgcolor: `${columnMeta.color}18`,
                border: `1px solid ${columnMeta.color}30`,
              }}
            >
              <Typography
                sx={{ fontSize: '0.7rem', fontWeight: 700, color: columnMeta.color, fontFamily: 'monospace' }}
              >
                {columnMeta.label}
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              px: 1.25,
              py: 0.4,
              borderRadius: '6px',
              bgcolor: PRIORITY_META[values.priority].bg,
              border: `1px solid ${PRIORITY_META[values.priority].color}30`,
            }}
          >
            <Typography
              sx={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: PRIORITY_META[values.priority].color,
                fontFamily: 'monospace',
              }}
            >
              {PRIORITY_META[values.priority].label}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        <Button
          onClick={closeModal}
          disabled={isSubmitting}
          sx={{
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { color: 'rgba(255,255,255,0.7)', bgcolor: 'rgba(255,255,255,0.05)' },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          variant="contained"
          disableElevation
          sx={{
            px: 3,
            fontWeight: 700,
            textTransform: 'none',
            bgcolor: '#3b82f6',
            borderRadius: '8px',
            '&:hover': { bgcolor: '#2563eb' },
            '&.Mui-disabled': { opacity: 0.5 },
          }}
        >
          {isSubmitting
            ? mode === 'create' ? 'Creating…' : 'Saving…'
            : mode === 'create' ? 'Create Task' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const inputStyles = {
  '& .MuiOutlinedInput-root': {
    bgcolor: 'rgba(255,255,255,0.03)',
    color: 'rgba(255,255,255,0.85)',
    borderRadius: '10px',
    fontFamily: '"Outfit", sans-serif',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.35)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' },
  '& .MuiFormHelperText-root': { color: '#f87171' },
  '& input::placeholder': { color: 'rgba(255,255,255,0.2)' },
  '& textarea::placeholder': { color: 'rgba(255,255,255,0.2)' },
}

const selectStyles = {
  '& .MuiOutlinedInput-root': {
    bgcolor: 'rgba(255,255,255,0.03)',
    color: 'rgba(255,255,255,0.85)',
    borderRadius: '10px',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.35)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' },
  '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.3)' },
}
