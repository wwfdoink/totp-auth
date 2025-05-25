import { app, screen, BrowserWindow, nativeTheme } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { registerIpcHandlers } from './ipc';
import { database } from './database';

async function createWindow() {
	await database.initDb();

	const displaySize = screen.getPrimaryDisplay().workAreaSize;

	const mainWindow = new BrowserWindow({
		width: 600,
		height: displaySize.height - 400,
		autoHideMenuBar: false,
		...(process.platform === 'linux' ? { icon } : {}),
		webPreferences: {
			preload: join(__dirname, '../preload/index.js'),
			sandbox: false,
		},
	});

	registerIpcHandlers();

	nativeTheme.themeSource = database.getDarkMode() ? 'dark' : 'light';
	// mainWindow.webContents.openDevTools();

	if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
		const debug = require('electron-debug');
		debug();
		mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
	} else {
		mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
	}
}

app.whenReady().then(async () => {
	electronApp.setAppUserModelId('com.electron');

	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window);
	});

	await createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
