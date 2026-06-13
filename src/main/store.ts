import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import Store from 'electron-store';
import type { MqttConnectionProfile } from '../renderer/views/Settings/subviews/types';

interface StoreSchema {
  mqttProfiles: Record<string, MqttConnectionProfile>;
}

// choose a stable folder inside the OS appData location
const APP_FOLDER_NAME = 'MqttClient'; // keep this stable across releases
const persistentDir = path.join(app.getPath('appData'), APP_FOLDER_NAME);

// ensure directory exists
try {
  fs.mkdirSync(persistentDir, { recursive: true });
} catch (e) {
  // ignore
}

// create store in that folder so installs/upgrades keep the same path
const store = new Store<StoreSchema>({
  cwd: persistentDir,
  defaults: {
    mqttProfiles: {},
  },
});

// Migration: if an old store exists in the default userData dir, copy values on first run
try {
  const legacyDir = app.getPath('userData');
  if (legacyDir && legacyDir !== persistentDir) {
    const legacyStore = new Store<StoreSchema>({ cwd: legacyDir });
    const legacyData = legacyStore.store || {};
    // if legacy has data and current store is empty -> migrate
    const currentKeys = Object.keys(store.store || {});
    const legacyKeys = Object.keys(legacyData || {});
    if (legacyKeys.length > 0 && currentKeys.length === 0) {
      for (const k of legacyKeys) {
        // copy each key
        // @ts-ignore
        store.set(k as any, legacyData[k as keyof typeof legacyData]);
      }
    }
  }
} catch (e) {
  // harmless if migration fails
}

export default store;
