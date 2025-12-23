export interface MqttConnectionProfile {
  id: string;
  name: string;
  host: string;
  port: number;
  protocol: 'mqtt' | 'mqtts' | 'ws' | 'wss';
  username?: string;
  password?: string;
  clientId?: string;
  caPath?: string;
  certPath?: string;
  keyPath?: string;
  cleanSession: boolean;
  keepAlive: number;
}

export interface MqttTestResult {
  success: boolean;
  message: string;
}
