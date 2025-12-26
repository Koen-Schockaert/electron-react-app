import { Box, Typography } from '@mui/joy';
import React from 'react';

interface PageLayoutProps {
  title?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  padding?: number;
}

export default function PageLayout({
  title,
  headerRight,
  children,
  padding = 0,
}: PageLayoutProps) {
  return (
    <Box
      sx={{
        height: '100%', // 🔒 bounded
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', // 🔒 critical
        bgcolor: '#0f172a',
        color: '#e5e7eb',
      }}
    >
      {(title || headerRight) && (
        <Box
          sx={{
            px: 2,
            py: 1,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: '#020617',
            borderBottom: '1px solid #1e293b',
          }}
        >
          {title && (
            <Typography
              level="title-lg"
              sx={{
                fontWeight: 700,
                color: '#f9fafb',
                letterSpacing: '0.02em',
              }}
            >
              {title}
            </Typography>
          )}
          {headerRight}
        </Box>
      )}

      {/* BODY */}
      <Box
        sx={{
          height: '100%',
          minHeight: 0, // ⭐ REQUIRED
          overflow: 'hidden', // ⭐ REQUIRED
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
