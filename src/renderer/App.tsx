import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import SettingsView from './views/Settings/SettingsView';
import MqttView from './views/MQTT/MqttView';
import JsonEditorView from './views/JsonEditor/JsonEditorView';
import { MqttProvider } from './context/MqttContext';

export default function App() {
  return (
    <MemoryRouter>
      <MqttProvider>
        <AppLayout>
          <Routes>
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/mqtt" element={<MqttView />} />
            <Route path="/json-editor" element={<JsonEditorView />} />
          </Routes>
        </AppLayout>
      </MqttProvider>
    </MemoryRouter>
  );
}
