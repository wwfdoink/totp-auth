import { ipcMain, clipboard } from 'electron';
import { nativeTheme } from 'electron/main';
import { database } from './database';
import jsqr from 'jsqr';
import { urlToTotpEntry } from './utils';

export const registerIpcHandlers = () => {
	ipcMain.handle('totpList', () => {
		return database.getTotpList();
	});

	ipcMain.handle('darkMode', () => {
		return database.getDarkMode();
	});

	ipcMain.handle('setDarkMode', (_event, darkModeEnbaled) => {
		nativeTheme.themeSource = darkModeEnbaled ? 'dark' : 'light';
		return database.setDarkMode(darkModeEnbaled);
	});

	ipcMain.handle('settings', () => {
		return database.getSettings();
	});

	ipcMain.handle('setSettings', (_event, settings) => {
		return database.setSettings(settings);
	});

	ipcMain.handle('removeTotpEntry', (_event, id: string) => {
		return database.removeTotpEntry(id);
	});

	ipcMain.handle('scan', async () => {
		const image = clipboard.readImage();
		const imageSize = image.getSize();
		const imageBuffer = new Uint8ClampedArray(image.toBitmap());

		const data = jsqr(imageBuffer, imageSize.width, imageSize.height);
		if (!data) {
			return false;
		}

		const totpEntry = urlToTotpEntry(new URL(data.data));
		if (!totpEntry) {
			return false;
		}

		return await database.addTotpEntry(totpEntry);
	});
};
