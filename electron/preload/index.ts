import { contextBridge, ipcRenderer } from 'electron';
import { SettingsEntry } from '../main/types';

contextBridge.exposeInMainWorld('api', {
	scan: () => ipcRenderer.invoke('scan'),
	totpList: () => ipcRenderer.invoke('totpList'),
	darkMode: () => ipcRenderer.invoke('darkMode'),
	setDarkMode: (darkModeEnabled: boolean) => ipcRenderer.invoke('setDarkMode', darkModeEnabled),
	setSettings: (newSettings: SettingsEntry) => ipcRenderer.invoke('setSettings', newSettings),
	removeTotpEntry: (id: string) => ipcRenderer.invoke('removeTotpEntry', id),
	settings: () => ipcRenderer.send('settings'),
	unlock: (password: string) => ipcRenderer.invoke('unlock', password),
});
