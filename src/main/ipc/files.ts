import { ipcMain, dialog } from 'electron';

export function registerFileIpcHandlers() {
  ipcMain.handle(
    'file:open',
    async (_event, options: Electron.OpenDialogOptions) => {
      const result = await dialog.showOpenDialog(options);
      if (result.canceled || result.filePaths.length === 0) {
        return null;
      }
      return result.filePaths[0];
    }
  );
}
