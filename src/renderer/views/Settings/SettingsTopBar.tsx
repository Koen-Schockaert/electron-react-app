import { Box, Button } from '@mui/joy';

type Props = {
  activeTab: 'mqtt' | 'other';
  onChangeTab: (tab: 'mqtt' | 'other') => void;
};

export default function SettingsTopBar({ activeTab, onChangeTab }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        p: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Button
        size="sm"
        variant={activeTab === 'mqtt' ? 'solid' : 'outlined'}
        onClick={() => onChangeTab('mqtt')}
      >
        MQTT
      </Button>

      <Button
        size="sm"
        variant={activeTab === 'other' ? 'solid' : 'outlined'}
        onClick={() => onChangeTab('other')}
      >
        Other
      </Button>
    </Box>
  );
}
