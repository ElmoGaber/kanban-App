'use client'

import { useCallback } from 'react'
import { Box, InputBase, IconButton, Tooltip } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import { useBoardStore } from '@/store/boardStore'

export default function BoardSearch() {
  const search = useBoardStore((s) => s.search)
  const setSearch = useBoardStore((s) => s.setSearch)

  const handleClear = useCallback(() => setSearch(''), [setSearch])

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: 38,
        px: 1.5,
        gap: 0.75,
        borderRadius: '9px',
        bgcolor: 'rgba(255,255,255,0.05)',
        border: '1px solid',
        borderColor: search ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)',
        width: { xs: '100%', sm: 260 },
        transition: 'border-color 0.2s',
        boxShadow: search ? '0 0 0 3px rgba(59,130,246,0.12)' : 'none',
        '&:focus-within': {
          borderColor: 'rgba(59,130,246,0.5)',
          boxShadow: '0 0 0 3px rgba(59,130,246,0.12)',
        },
      }}
    >
      <SearchIcon
        sx={{
          fontSize: 16,
          color: search ? '#3b82f6' : 'rgba(255,255,255,0.3)',
          flexShrink: 0,
          transition: 'color 0.2s',
        }}
      />
      <InputBase
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks…"
        sx={{
          flex: 1,
          fontSize: '0.82rem',
          color: 'rgba(255,255,255,0.85)',
          fontFamily: '"Outfit", sans-serif',
          '& input::placeholder': { color: 'rgba(255,255,255,0.25)', opacity: 1 },
        }}
      />
      {search && (
        <Tooltip title="Clear" arrow>
          <IconButton
            size="small"
            onClick={handleClear}
            sx={{
              p: 0.25,
              color: 'rgba(255,255,255,0.3)',
              '&:hover': { color: 'rgba(255,255,255,0.7)' },
            }}
          >
            <ClearIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}
