import { Box } from '@mui/joy';
import { useState } from 'react';
import SettingsTopBar from './SettingsTopBar';
import MqttSettings from './subviews/MqttSettings';
import OtherSettings from './subviews/OtherSettings';

type SettingsTab = 'mqtt' | 'other';

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('mqtt');

  const renderContent = () => {
    switch (activeTab) {
      case 'mqtt':
        return <MqttSettings />;
      case 'other':
        return <OtherSettings />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
      <SettingsTopBar activeTab={activeTab} onChangeTab={setActiveTab} />
      <Box sx={{ p: 2, overflowY: 'auto' }}>{renderContent()}</Box>
    </Box>
  );
}
