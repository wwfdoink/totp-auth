import { readFile, writeFile } from 'fs/promises';
import { DBSchema, TOTPEntry } from './types';

const INITIAL_DB = {
	totpList: [],
	settings: {
		darkMode: false,
	},
	encryption: {},
} as DBSchema;

class DB {
	data = INITIAL_DB;

	async initDb() {
		try {
			const content = await readFile('db.json', 'utf8');
			this.data = JSON.parse(content);
		} catch (error) {
			this.data = INITIAL_DB;
			await this.commit();
		}
	}

	async commit() {
		try {
			await writeFile('db.json', JSON.stringify(this.data));
		} catch (error) {
			return false;
		}
		return true;
	}

	getTotpList() {
		return this.data.totpList;
	}

	getDarkMode() {
		return !!this.data.settings.darkMode;
	}

	setDarkMode(darkModeEnabled: boolean) {
		this.data.settings.darkMode = darkModeEnabled;
		return this.commit();
	}

	addTotpEntry(entry: TOTPEntry) {
		this.data.totpList.push(entry);
		return this.commit();
	}

	removeTotpEntry(id: string) {
		this.data.totpList = this.data.totpList.filter((e) => e.id !== id);
		return this.commit();
	}

	getSettings() {
		return this.data.settings;
	}

	setSettings(newSettings: typeof this.data.settings) {
		return (this.data.settings = newSettings);
	}
}

const database: DB = new DB();

export { database };
