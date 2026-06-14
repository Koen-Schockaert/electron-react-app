/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import fs from 'fs/promises';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import atomically from 'atomically';
import { registerMqttIpcHandlers } from './ipc/mqtt';
import { registerFileIpcHandlers } from './ipc/files';
import { registerMqttTestHandler } from './ipc/mqtt';
import { registerMqttConnectHandler } from './ipc/mqtt';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('ipc-ready-check', (event) => {
  event.returnValue = true;
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug').default();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  registerMqttIpcHandlers();
  registerFileIpcHandlers();
  registerMqttTestHandler();
  registerMqttConnectHandler();

  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Atomic file write exposed to renderer
ipcMain.handle(
  'write-file-atomic',
  async (_event, filePath: string, data: string) => {
    const fullPath = path.resolve(app.getPath('userData'), filePath);
    await atomically.writeFile(fullPath, data);
    return true;
  },
);

// safe write handler — writes to app userData/data/<basename>
// works for dev and packaged apps (userData is writable in both)
ipcMain.handle('write-file', async (_evt, relativeName: string, content: string) => {
  try {
    const safeName = path.basename(relativeName);
    const userDataDir = path.join(app.getPath('userData'), 'data');
    await fs.mkdir(userDataDir, { recursive: true });
    const full = path.join(userDataDir, safeName);
    await fs.writeFile(full, content, 'utf8');
    console.log('write-file: wrote', full);

    // notify renderer(s)
    try {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('file-changed', safeName);
      }
    } catch (e) {
      console.warn('write-file: failed to send file-changed event', e);
    }

    return { ok: true, path: full };
  } catch (err: any) {
    console.error('write-file error', err);
    return { ok: false, error: err?.message ?? String(err) };
  }
});

// read handler — prefer userData copy, fallback to bundled source
ipcMain.handle('read-file', async (_evt, relativeName: string) => {
  try {
    const safeName = path.basename(relativeName);
    const userDataDir = path.join(app.getPath('userData'), 'data');
    const userPath = path.join(userDataDir, safeName);

    // try userData copy first
    try {
      const content = await fs.readFile(userPath, 'utf8');
      console.log('read-file: loaded from userData', userPath);
      return { ok: true, content, source: 'user' };
    } catch {
      // ignore, try bundled
    }

    // fallback: packaged/bundled file inside app
    // in development, app.getAppPath() usually points to project root; in prod it points to resources
    const bundledPath = path.join(app.getAppPath(), 'src', 'renderer', 'data', safeName);
    try {
      const content = await fs.readFile(bundledPath, 'utf8');
      console.log('read-file: loaded bundled', bundledPath);
      return { ok: true, content, source: 'bundled' };
    } catch (e) {
      console.warn('read-file: bundled not found', bundledPath, e);
    }

    // last resort: attempt to read from resources path (PACKAGED)
    try {
      const resourcesBundled = path.join(process.resourcesPath, 'app', 'renderer', 'data', safeName);
      const content = await fs.readFile(resourcesBundled, 'utf8');
      console.log('read-file: loaded resources', resourcesBundled);
      return { ok: true, content, source: 'resources' };
    } catch (e) {
      console.warn('read-file: resources fallback not found', e);
    }

    return { ok: false, error: 'file not found' };
  } catch (err: any) {
    console.error('read-file error', err);
    return { ok: false, error: err?.message ?? String(err) };
  }
});

// 🔥 logging (important for debugging updates)
autoUpdater.logger = log;
(autoUpdater.logger as any).transports.file.level = "info";

autoUpdater.on("update-available", () => {
  console.log("Update available");
});

autoUpdater.on("update-downloaded", () => {
  console.log("Update downloaded, restarting...");

  autoUpdater.quitAndInstall();
});

app
  .whenReady()
  .then(() => {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

