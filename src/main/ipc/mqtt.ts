import { ipcMain, IpcMainInvokeEvent } from 'electron';import store from '../store';
//import { MqttConnectionProfile } from '../../renderer/views/Settings/subviews/types';
import mqtt, { MqttClient, IClientOptions, Packet } from 'mqtt';
import fs from 'fs';
import type {
  MqttConnectionProfile,
  MqttTestResult,
} from '../../renderer/views/Settings/subviews/types';



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
          reconnectPeriod: 0, // IMPORTANT: no retries
          connectTimeout: 5_000,
        };

        // TLS options
        if (profile.caPath) options.ca = fs.readFileSync(profile.caPath);
        if (profile.certPath) options.cert = fs.readFileSync(profile.certPath);
        if (profile.keyPath) options.key = fs.readFileSync(profile.keyPath);

        return await new Promise<MqttTestResult>((resolve) => {
          const client = mqtt.connect(options);

          const cleanup = () => {
            client.end(true);
          };

          function connackMessage(code?: number): string {
            switch (code) {
              case 0:
                return 'Connection accepted';
              case 1:
                return 'Connection refused: unacceptable protocol version';
              case 2:
                return 'Connection refused: identifier rejected';
              case 3:
                return 'Connection refused: broker unavailable';
              case 4:
                return 'Bad username or password';
              case 5:
                return 'Not authorized';
              default:
                return 'Connection rejected by broker';
            }
          }

          let settled = false;
          const finish = (result: MqttTestResult) => {
            if (!settled) {
              settled = true;
              cleanup();
              resolve(result);
            }
          };

          client.once('connect', (connack) => {
            if (connack.returnCode === 0) {
              finish({
                success: true,
                message: 'Connection successful',
              });
            } else {
              finish({
                success: false,
                message: connackMessage(connack.returnCode),
              });
            }
          });

          client.once('error', (err) => {
            finish({ success: false, message: err.message });
          });

          setTimeout(() => {
            cleanup();
            resolve({
              success: false,
              message: 'Connection timed out',
            });
          }, 5_000);
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
  // Connect to MQTT broker
  ipcMain.handle('mqtt/connect', (event: IpcMainInvokeEvent, options: IClientOptions & { url: string }) => {
    return new Promise<string>((resolve, reject) => {
      if (client) client.end(); // disconnect previous connection
      client = mqtt.connect(options.url, options);

      client.on('connect', () => {
        console.log('MQTT connected');
        resolve('connected');
      });

      client.on('error', (err: Error) => {
        console.error('MQTT error', err);
        reject(err.message);
      });

      // Forward messages to renderer
      client.on('message', (topic: string, message: Buffer, packet: Packet) => {
        event.sender.send('mqtt/message', { topic, message: message.toString() });
      });
    });
  });

  // Disconnect from MQTT broker
  ipcMain.handle('mqtt/disconnect', () => {
    return new Promise<string>((resolve, reject) => {
      if (!client) return resolve('No active connection');
      client.end(false, {}, () => {
        console.log('MQTT disconnected');
        client = null;
        resolve('disconnected');
      });
    });
  });

  // Subscribe to topics
  ipcMain.handle('mqtt/subscribe', (event: IpcMainInvokeEvent, topic: string) => {
    return new Promise<string>((resolve, reject) => {
      if (!client) return reject('Not connected');
      client.subscribe(topic, (err, granted) => {
        if (err) reject(err.message);
        else resolve(`Subscribed to ${topic}`);
      });
    });
  });

  // Publish message
  ipcMain.handle('mqtt/publish', (event: IpcMainInvokeEvent, { topic, message }: { topic: string; message: string }) => {
    return new Promise<string>((resolve, reject) => {
      if (!client) return reject('Not connected');
      client.publish(topic, message, (err) => {
        if (err) reject(err.message);
        else resolve(`Published to ${topic}`);
      });
    });
  });
}
