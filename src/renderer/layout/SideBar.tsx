// src/renderer/layout/Sidebar.tsx
import { List, ListItemButton, ListItemDecorator, Typography, Box } from '@mui/joy';
import { useNavigate, useLocation } from 'react-router-dom';
import { menuItems } from '../navigation/MenuConfig';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        bgcolor: '#020617',
        borderRight: '1px solid #1e293b',
        height: '100%',
        p: 1,
      }}
    >
      <List sx={{ gap: 0.5 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.route;

          return (
            <ListItemButton
              key={item.id}
              onClick={() => navigate(item.route)}
              selected={active}
              sx={{
                borderRadius: 6,
                px: 1.5,
                py: 1,
                color: '#e5e7eb',

                '& .MuiSvgIcon-root': {
                  color: active ? '#60a5fa' : '#9ca3af',
                },

                '&:hover': {
                  bgcolor: '#0f172a',
                },

                '&.Mui-selected': {
                  bgcolor: '#1e293b',
                  color: '#ffffff',
                },

                '&.Mui-selected:hover': {
                  bgcolor: '#1e293b',
                },
              }}
            >
              <ListItemDecorator>
                <item.icon fontSize="small" />
              </ListItemDecorator>

              <Typography level="body-sm" sx={{ fontWeight: active ? 600 : 400 }}>
                {item.label}
              </Typography>
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
