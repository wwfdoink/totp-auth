import { ipcMain, clipboard } from 'electron';
import { nativeTheme } from 'electron/main';
import jsqr from 'jsqr';
import { encrypt, decrypt } from './encrypter';
import { database } from './database';
import { urlToTotpEntry } from './utils';

let password: string | undefined = undefined;

export const registerIpcHandlers = () => {
	ipcMain.handle('totpList', async () => {
		return await Promise.all(
			database.getTotpList().map(async (entry) => ({
				...entry,
				secret: await decrypt(entry.secret, password!),
			})),
		);
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
		totpEntry.secret = encrypt(totpEntry.secret, password!);
		return await database.addTotpEntry(totpEntry);
	});

	ipcMain.handle('unlock', async (_event, unlockPassword: string) => {
		const totpList = database.getTotpList();
		if (totpList.length < 1) {
			password = unlockPassword;
			return true;
		}

		try {
			await decrypt(totpList[0].secret, unlockPassword!);
			password = unlockPassword;
		} catch (error) {
			return false;
		}
		return true;
	});
};
