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
    <Box sx={{ width: 260, borderRight: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ p: 1 }}>
        <Button size="sm" fullWidth onClick={onCreate}>
          + Add Profile
        </Button>
      </Box>

      <List>
        {Object.values(profiles).map((profile) => {
          const isConnected = connected && connectedProfileId === profile.id;
          const isDisabled = connected && !isConnected;

          return (
            <ListItem
              key={profile.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: profile.id === activeId ? 'neutral.softBg' : undefined,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.5 : 1,
                px: 1,
              }}
              onClick={() => {
                if (!isDisabled) onSelect(profile.id);
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography level="body-sm">{profile.name || 'Unnamed'}</Typography>
                {isConnected && (
                  <Chip size="sm" color="success" variant="soft">
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
