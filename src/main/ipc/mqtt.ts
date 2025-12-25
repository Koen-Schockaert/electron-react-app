import { ipcMain, IpcMainInvokeEvent } from 'electron';
import store from '../store';
import mqtt, { MqttClient, IClientOptions, IPublishPacket } from 'mqtt';
import fs from 'fs';
import type {
  MqttConnectionProfile,
  MqttTestResult,
} from '../../renderer/views/Settings/subviews/types';
import { WebContents } from 'electron';

let mqttSender: WebContents | null = null;

let client: MqttClient | null = null;

type MqttProfilesMap = Record<string, MqttConnectionProfile>;

export function registerMqttIpcHandlers() {
  ipcMain.handle('mqtt:getProfiles', (): MqttProfilesMap => {
    return store.get('mqttProfiles');
  });

  ipcMain.handle(
    'mqtt:setProfiles',
    (_event, profiles: MqttProfilesMap): void => {
      store.set('mqttProfiles', profiles);
    },
  );

  ipcMain.handle('mqtt:deleteProfile', (_event, profileId: string): void => {
    const profiles = store.get('mqttProfiles');
    delete profiles[profileId];
    store.set('mqttProfiles', profiles);
  });

  ipcMain.handle(
    'mqtt:upsertProfile',
    (_event, profile: MqttConnectionProfile): void => {
      const profiles = store.get('mqttProfiles');
      profiles[profile.id] = profile;
      store.set('mqttProfiles', profiles);
    },
  );
}

export function registerMqttTestHandler() {
  ipcMain.handle(
    'mqtt:testConnection',
    async (_event, profile: MqttConnectionProfile): Promise<MqttTestResult> => {
      try {
        const options: mqtt.IClientOptions = {
          host: profile.host,
          port: profile.port,
          protocol: profile.protocol,
          username: profile.username,
          password: profile.password,
          clientId: profile.clientId,
          clean: profile.cleanSession,
          keepalive: profile.keepAlive,
          reconnectPeriod: 0,
          connectTimeout: 5_000,
        };

        if (profile.caPath) options.ca = fs.readFileSync(profile.caPath);
        if (profile.certPath) options.cert = fs.readFileSync(profile.certPath);
        if (profile.keyPath) options.key = fs.readFileSync(profile.keyPath);

        return await new Promise<MqttTestResult>((resolve) => {
          const testClient = mqtt.connect(options);

          const finish = (result: MqttTestResult) => {
            testClient.end(true);
            resolve(result);
          };

          testClient.once('connect', () =>
            finish({ success: true, message: 'Connection successful' }),
          );
          testClient.once('error', (err) =>
            finish({ success: false, message: err.message }),
          );

          setTimeout(
            () =>
              finish({
                success: false,
                message: 'Connection timed out',
              }),
            5_000,
          );
        });
      } catch (err) {
        return {
          success: false,
          message: err instanceof Error ? err.message : 'Unknown error',
        };
      }
    },
  );
}

export function registerMqttConnectHandler() {
  ipcMain.handle('mqtt/connect', (ipcEvent: IpcMainInvokeEvent, options) => {
    return new Promise<string>((resolve, reject) => {
      if (client) client.end(true);

      mqttSender = ipcEvent.sender;

      client = mqtt.connect(options.url, options);

      client.on('connect', () => resolve('connected'));

      client.on('error', (err) => reject(err.message));

      client.on('message', (topic, message, packet) => {
        if (!mqttSender || mqttSender.isDestroyed()) return;

        const publishPacket = packet as IPublishPacket;

        mqttSender.send('mqtt/message', {
          topic,
          message: message.toString(),
          qos: publishPacket.qos,
          retain: publishPacket.retain,
        });
      });
    });
  });

  ipcMain.handle('mqtt/disconnect', () => {
    return new Promise<string>((resolve) => {
      if (!client) return resolve('No active connection');

      client.end(false, {}, () => {
        client = null;
        mqttSender = null;
        resolve('disconnected');
      });
    });
  });

  /* ===== SUBSCRIBE (QoS-aware) ===== */
  ipcMain.handle(
    'mqtt/subscribe',
    (_event: IpcMainInvokeEvent, topic: string, qos: 0 | 1 | 2 = 0) => {
      return new Promise<void>((resolve, reject) => {
        if (!client) return reject('Not connected');

        client.subscribe(topic, { qos }, (err) => {
          if (err) reject(err.message);
          else resolve();
        });
      });
    },
  );

  /* ===== UNSUBSCRIBE ===== */
  ipcMain.handle(
    'mqtt/unsubscribe',
    (_event: IpcMainInvokeEvent, topic: string) => {
      return new Promise<void>((resolve, reject) => {
        if (!client) return reject('Not connected');

        client.unsubscribe(topic, (err) => {
          if (err) reject(err.message);
          else resolve();
        });
      });
    },
  );

  /* ===== PUBLISH ===== */
  ipcMain.handle(
    'mqtt/publish',
    (
      _event: IpcMainInvokeEvent,
      {
        topic,
        message,
        qos = 0,
        retain = false,
      }: {
        topic: string;
        message: string;
        qos?: 0 | 1 | 2;
        retain?: boolean;
      },
    ) => {
      return new Promise<void>((resolve, reject) => {
        if (!client) return reject('Not connected');

        client.publish(topic, message, { qos, retain }, (err) => {
          if (err) reject(err.message);
          else resolve();
        });
      });
    },
  );
}
