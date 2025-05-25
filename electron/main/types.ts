export type DBSchema = {
	totpList: TOTPEntry[];
	settings: SettingsEntry;
};

export type SettingsEntry = {
	darkMode?: boolean;
};

export type TOTPEntry = {
	id: string;
	username: string;
	secret: string;
	issuer: string;
	digits: number;
	period: number;
	algorithm: 'SHA-1' | 'SHA-384' | 'SHA-256' | 'SHA-512' | 'SHA-224' | 'SHA3-224' | 'SHA3-256' | 'SHA3-384' | 'SHA3-512';
};
