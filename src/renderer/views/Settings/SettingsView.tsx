import { Box } from '@mui/joy';
import { useState } from 'react';
import SettingsTopBar from './SettingsTopBar';
import MqttSettings from './subviews/MqttSettings';
import OtherSettings from './subviews/OtherSettings';
import PageLayout from '../../layout/PageLaout';

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
    <PageLayout title="Settings">
      {/* Top bar */}
      <SettingsTopBar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      {/* Content area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
        }}
      >
        {renderContent()}
      </Box>
    </PageLayout>
  );
}
