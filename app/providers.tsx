'use client'

import { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material'
import { queryClient } from '@/lib/queryClient'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3b82f6' },
    background: {
      default: '#060e18',
      paper: '#0d1b2a',
    },
    text: {
      primary: 'rgba(255,255,255,0.9)',
      secondary: 'rgba(255,255,255,0.5)',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Helvetica Neue", sans-serif',
  },
  shape: { borderRadius: 10 },
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0d1b2a',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.84rem',
          color: 'rgba(255,255,255,0.75)',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
        },
      },
    },
  },
})

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
