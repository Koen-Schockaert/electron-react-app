import { Box } from '@mui/joy';
import Sidebar from './SideBar';

export function AppLayout({ children }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        height: '100vh',
      }}
    >
      <Sidebar />
      <Box sx={{ overflow: 'hidden' }}>{children}</Box>
    </Box>
  );
}
