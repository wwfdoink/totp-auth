import { Injectable } from '@angular/core';
import { SettingsEntry, TOTPEntry } from '../types';
import { Subject } from 'rxjs';

declare global {
	interface Window {
		api: {
			scan: () => Promise<boolean>;
			settings: () => Promise<SettingsEntry>;
			darkMode: () => Promise<boolean>;
			setDarkMode: (darkMode: boolean) => Promise<boolean>;
			totpList: () => Promise<TOTPEntry[]>;
			removeTotpEntry: (id: string) => Promise<boolean>;
			unlock: (password: string) => Promise<boolean>;
		};
	}
}

@Injectable({
	providedIn: 'root',
})
export class ElectronService {
	onDbChange = new Subject<number>();

	unlock(password: string) {
		return window.api.unlock(password);
	}

	scan() {
		return window.api.scan();
	}

	totpList() {
		return window.api.totpList();
	}

	settings() {
		return window.api.settings();
	}

	darkMode() {
		return window.api.darkMode();
	}

	async setDarkMode(darkModeEnabled: boolean) {
		const result = await window.api.setDarkMode(darkModeEnabled);
		if (result) {
			this.onDbChange.next(Date.now());
		}
		return result;
	}

	async removeTotpEntry(id: string) {
		const result = await window.api.removeTotpEntry(id);
		if (result) {
			this.onDbChange.next(Date.now());
		}
		return result;
	}
}
