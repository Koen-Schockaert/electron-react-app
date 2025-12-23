import { contextBridge, ipcRenderer } from 'electron';
import type {
  MqttConnectionProfile,
  MqttTestResult,
} from '../renderer/views/Settings/subviews/types';

type MqttProfilesMap = Record<string, MqttConnectionProfile>;

export interface MqttSettingsAPI {
  // Profiles
  getMqttProfiles: () => Promise<Record<string, MqttConnectionProfile>>;
  upsertMqttProfile: (profile: MqttConnectionProfile) => Promise<void>;
  deleteMqttProfile: (profileId: string) => Promise<void>;
  testMqttConnection: (
    profile: MqttConnectionProfile,
  ) => Promise<MqttTestResult>;

  // Passwords (secure via keytar in main process)
  setMqttPassword: (profileId: string, password: string) => Promise<void>;
  getMqttPassword: (profileId: string) => Promise<string | null>;
  deleteMqttPassword: (profileId: string) => Promise<void>;
}

contextBridge.exposeInMainWorld('electronAPI', {
  writeFileAtomic: (filePath: string, data: string) =>
    ipcRenderer.invoke('write-file-atomic', filePath, data),
});

contextBridge.exposeInMainWorld('settingsAPI', {
  // --- MQTT Profiles ---
  getMqttProfiles: () => ipcRenderer.invoke('mqtt:getProfiles'),
  upsertMqttProfile: (profile: MqttConnectionProfile) =>
    ipcRenderer.invoke('mqtt:upsertProfile', profile),
  deleteMqttProfile: (profileId: string) =>
    ipcRenderer.invoke('mqtt:deleteProfile', profileId),
  testMqttConnection: (profile: MqttConnectionProfile) =>
    ipcRenderer.invoke('mqtt:testConnection', profile),

  // --- Secure Passwords ---
  setMqttPassword: (profileId: string, password: string) =>
    ipcRenderer.invoke('mqtt:setPassword', profileId, password),
  getMqttPassword: (profileId: string) =>
    ipcRenderer.invoke('mqtt:getPassword', profileId),
  deleteMqttPassword: (profileId: string) =>
    ipcRenderer.invoke('mqtt:deletePassword', profileId),
} as MqttSettingsAPI);

contextBridge.exposeInMainWorld('fileAPI', {
  openFile: (options: Electron.OpenDialogOptions): Promise<string | null> =>
    ipcRenderer.invoke('file:open', options),
});

ipcRenderer.sendSync('ipc-ready-check');
