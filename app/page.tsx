'use client'

import { Box, Typography, Button, Divider } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import GridViewIcon from '@mui/icons-material/GridView'
import KanbanBoard from '@/features/tasks/components/KanbanBoard'
import TaskFormModal from '@/features/tasks/components/TaskFormModal'
import BoardSearch from '@/features/tasks/components/BoardSearch'
import { useBoardStore } from '@/store/boardStore'

export default function BoardPage() {
  const openCreateModal = useBoardStore((s) => s.openCreateModal)

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#060e18',
        backgroundImage: `
          radial-gradient(ellipse at 20% 0%, rgba(59,130,246,0.06) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 100%, rgba(167,139,250,0.04) 0%, transparent 60%)
        `,
      }}
    >
      <Box
        component="header"
        sx={{
          height: 60,
          px: { xs: 2, sm: 3, md: 4 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(12px)',
          bgcolor: 'rgba(6,14,24,0.8)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '9px',
              bgcolor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(59,130,246,0.4)',
            }}
          >
            <GridViewIcon sx={{ fontSize: 17, color: '#fff' }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: '0.88rem',
                letterSpacing: '-0.02em',
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.2,
              }}
            >
              Kanban Board
            </Typography>
            <Typography
              sx={{
                fontSize: '0.66rem',
                color: 'rgba(255,255,255,0.28)',
                fontFamily: 'monospace',
                lineHeight: 1,
              }}
            >
              Task Management
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <BoardSearch />

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              height: 24,
              alignSelf: 'center',
              borderColor: 'rgba(255,255,255,0.07)',
              display: { xs: 'none', sm: 'block' },
            }}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: '16px !important' }} />}
            onClick={() => openCreateModal()}
            disableElevation
            sx={{
              height: 36,
              px: 2.5,
              fontWeight: 700,
              fontSize: '0.78rem',
              textTransform: 'none',
              bgcolor: '#3b82f6',
              borderRadius: '9px',
              letterSpacing: '0.01em',
              '&:hover': { bgcolor: '#2563eb' },
              display: { xs: 'none', sm: 'flex' },
            }}
          >
            New Task
          </Button>

          <Button
            variant="contained"
            onClick={() => openCreateModal()}
            disableElevation
            sx={{
              minWidth: 36,
              width: 36,
              height: 36,
              p: 0,
              bgcolor: '#3b82f6',
              borderRadius: '9px',
              '&:hover': { bgcolor: '#2563eb' },
              display: { xs: 'flex', sm: 'none' },
            }}
          >
            <AddIcon sx={{ fontSize: 19 }} />
          </Button>
        </Box>
      </Box>

      <Box
        component="main"
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          pt: 3,
          pb: 4,
        }}
      >
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.76rem', fontFamily: 'monospace' }}>
            Drag cards between columns to update status
          </Typography>
          <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.12)' }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.76rem', fontFamily: 'monospace' }}>
            Ctrl+Enter to submit in modal
          </Typography>
        </Box>

        <KanbanBoard />
      </Box>

      <TaskFormModal />
    </Box>
  )
}
