import React from 'react';
import { Box, Button } from '@mui/joy';

type Props = {
  activeTab: 'mqtt' | 'other' | 'files';
  onChangeTab: (t: 'mqtt' | 'other' | 'files') => void;
};

export default function SettingsTopBar({ activeTab, onChangeTab }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        p: 2,
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

      <Button
        size="sm"
        variant={activeTab === 'files' ? 'solid' : 'outlined'}
        color={activeTab === 'files' ? 'primary' : 'neutral'}
        onClick={() => onChangeTab('files')}
        sx={{ color: '#e5e7eb' }}
      >
        Files
      </Button>
    </Box>
  );
}
