// src/renderer/types/global.ts
import { MqttConnectionProfile } from '../views/Settings/subviews/types';
import { MqttTestResult } from '../views/Settings/subviews/types';

export {};

export interface MqttMessage {
  topic: string;
  message: string;
}

export interface TopicInfo {
  topic: string;
  count: number;
}

export interface MqttSubscription {
  topic: string;
  qos: 0 | 1 | 2;
}

export interface MqttAPI {
  connect: (options: { url: string; username?: string; password?: string }) => Promise<string>;
  disconnect: () => Promise<string>;
  subscribe: (topic: string, qos?: 0 | 1 | 2) => Promise<void>;
  unsubscribe: (topic: string) => Promise<void>;
  publish: (
    topic: string,
    message: string,
    qos?: 0 | 1 | 2,
    retain?: boolean,
  ) => Promise<void>;
  onMessage: (
    cb: (msg: {
      topic: string;
      message: string;
      qos: number;
      retain: boolean;
    }) => void,
  ) => () => void;
}

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
    mqttAPI: MqttAPI;
  }
}
