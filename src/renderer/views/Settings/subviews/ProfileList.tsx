import { List, ListItem, Typography, Button, Box, Chip } from '@mui/joy';
import type { MqttConnectionProfile } from './types';

interface ProfileListProps {
  profiles: Record<string, MqttConnectionProfile>;
  activeId: string | null;
  connectedProfileId: string | null;
  connected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export default function ProfileList({
  profiles,
  activeId,
  connectedProfileId,
  connected,
  onSelect,
  onDelete,
  onCreate,
}: ProfileListProps) {
  return (
    <Box
      sx={{
        width: 260,
        borderRight: '1px solid #1e293b',
        bgcolor: '#0f172a',
        color: '#e5e7eb',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 1 }}>
        <Button
          size="sm"
          fullWidth
          variant="outlined"
          onClick={onCreate}
          sx={{
            borderColor: '#1e293b',
            color: '#e5e7eb',
            '&:hover': {
              borderColor: '#3b82f6',
              color: '#3b82f6',
            },
          }}
        >
          + Add Profile
        </Button>
      </Box>

      <List sx={{ flex: 1, overflowY: 'auto' }}>
        {Object.values(profiles).map((profile) => {
          const isConnected = connected && connectedProfileId === profile.id;
          const isDisabled = connected && !isConnected;
          const isActive = profile.id === activeId;

          return (
            <ListItem
              key={profile.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: isActive ? '#1e293b' : 'transparent',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.5 : 1,
                px: 1,
                py: 0.5,
                '&:hover': {
                  bgcolor: !isActive && !isDisabled ? '#1e293b' : undefined,
                },
              }}
              onClick={() => {
                if (!isDisabled) onSelect(profile.id);
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography level="body-sm">{profile.name || 'Unnamed'}</Typography>
                {isConnected && (
                  <Chip
                    size="sm"
                    color="success"
                    variant="soft"
                    sx={{ bgcolor: '#166534', color: '#dcfce7' }}
                  >
                    Connected
                  </Chip>
                )}
              </Box>

              <Button
                size="sm"
                color="danger"
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(profile.id);
                }}
                sx={{
                  borderColor: '#7f1d1d',
                  color: '#fca5a5',
                  '&:hover': {
                    borderColor: '#f87171',
                    color: '#f87171',
                  },
                }}
              >
                Delete
              </Button>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
