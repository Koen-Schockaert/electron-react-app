import { List, ListItem, Typography, Button, Box } from '@mui/joy';
import type { MqttConnectionProfile } from './types';

interface ProfileListProps {
  profiles: Record<string, MqttConnectionProfile>;
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export default function ProfileList({
  profiles,
  activeId,
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
        {Object.values(profiles).map((profile) => (
          <ListItem
            key={profile.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: profile.id === activeId ? 'neutral.softBg' : undefined,
              cursor: 'pointer',
            }}
            onClick={() => onSelect(profile.id)}
          >
            <Typography level="body-sm">{profile.name}</Typography>
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
        ))}
      </List>
    </Box>
  );
}
