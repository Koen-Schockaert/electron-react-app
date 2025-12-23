import { ipcMain } from 'electron';
import store from './store.js'

import type { MqttConnectionProfile } from '../renderer/views/Settings/subviews/types'
ipcMain.handle('get-mqtt-profiles', () => {
  return store.get('mqttProfiles');
});

ipcMain.handle('save-mqtt-profile', (_event, profile: MqttConnectionProfile) => {
  const profiles = store.get('mqttProfiles');
  profiles[profile.id] = profile;
  store.set('mqttProfiles', profiles);
  return profile;
});
