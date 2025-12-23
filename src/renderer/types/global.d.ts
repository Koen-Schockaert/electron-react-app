import { MqttConnectionProfile } from '../views/Settings/subviews/types';
import { MqttTestResult } from '../views/Settings/subviews/types';

export {};

declare global {
  interface Window {
    settingsAPI: {
      getMqttProfiles: () => Promise<Record<string, MqttConnectionProfile>>;
      upsertMqttProfile(profile: MqttConnectionProfile): Promise<void>;
      deleteMqttProfile(profileId: string): Promise<void>;
      testMqttConnection(profile: MqttConnectionProfile): Promise<MqttTestResult>;
      setMqttPassword(profileId: string, password: string): Promise<void>;
getMqttPassword(profileId: string): Promise<string | null>;
deleteMqttPassword(profileId: string): Promise<void>;
    };
    fileAPI: {
      openFile(options: Electron.OpenDialogOptions): Promise<string | null>;
    };

  }
}
