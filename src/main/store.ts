import Store from 'electron-store';
import { MqttConnectionProfile } from '../renderer/views/Settings/subviews/types';

interface StoreSchema {
  mqttProfiles: Record<string, MqttConnectionProfile>;
}

const store = new Store<StoreSchema>({
  defaults: {
    mqttProfiles: {},
  },
});

export default store;
