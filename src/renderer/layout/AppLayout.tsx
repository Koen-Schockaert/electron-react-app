// src/renderer/layout/AppLayout.tsx
import { Box } from '@mui/joy';
import Sidebar from './SideBar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden', // 🔴 critical
        bgcolor: '#0f172a',
        color: '#e5e7eb',
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          flexShrink: 0,
          height: '100%',
          overflow: 'auto',
          borderRight: '1px solid #1e293b',
          bgcolor: '#020617',
        }}
      >
        <Sidebar />
      </Box>

      {/* Main content */}
      <Box
        sx={{
          flex: 1,
          height: '100%',
          overflow: 'hidden', // 🔴 critical
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
