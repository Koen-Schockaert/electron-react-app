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
        bgcolor: '#020617', // dark background like MQTTView header
        borderBottom: '1px solid #1e293b', // subtle divider
      }}
    >
      <Button
        size="sm"
        variant={activeTab === 'mqtt' ? 'solid' : 'outlined'}
        color={activeTab === 'mqtt' ? 'primary' : 'neutral'}
        onClick={() => onChangeTab('mqtt')}
        sx={{ color: '#e5e7eb' }} // ensures text is white for outlined button
      >
        MQTT
      </Button>

      <Button
        size="sm"
        variant={activeTab === 'other' ? 'solid' : 'outlined'}
        color={activeTab === 'other' ? 'primary' : 'neutral'}
        onClick={() => onChangeTab('other')}
        sx={{ color: '#e5e7eb' }}
      >
        Other
      </Button>
    </Box>
  );
}
