import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import SettingsView from './views/Settings/SettingsView';
import MqttView from './views/MQTT/MqttView';

export default function App() {
  return (
    <MemoryRouter>
      <AppLayout>
        <Routes>
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/mqtt" element={<MqttView />} />
        </Routes>
      </AppLayout>
    </MemoryRouter>
  );
}
