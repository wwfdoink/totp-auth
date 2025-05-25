import { randomUUID } from 'crypto';
import { TOTPEntry } from './types';

export const urlToTotpEntry = (url: URL): TOTPEntry | void => {
	const username = url.username;
	const secret = url.searchParams.get('secret')!;
	const issuer = url.searchParams.get('issuer')!;
	const digits = parseInt(url.searchParams.get('digits') ?? '6');
	const period = parseInt(url.searchParams.get('period') ?? '30');
	const algorithm = url.searchParams.get('algorithm')?.replace('-', '');

	const convertAlgorithmName = (
		algorithm?: string,
	): 'SHA-1' | 'SHA-384' | 'SHA-256' | 'SHA-512' | 'SHA-224' | 'SHA3-224' | 'SHA3-256' | 'SHA3-384' | 'SHA3-512' => {
		if (algorithm?.startsWith('SHA3')) {
			return algorithm.replace(/(.{4})/, '$1-') as ReturnType<typeof convertAlgorithmName>;
		}
		if (algorithm?.startsWith('SHA')) {
			return algorithm.replace(/(.{3})/, '$1-') as ReturnType<typeof convertAlgorithmName>;
		}
		return 'SHA-1';
	};

	if (!secret) {
		return;
	}

	return {
		id: randomUUID(),
		username,
		secret,
		issuer,
		digits,
		period,
		algorithm: convertAlgorithmName(algorithm),
	};
};
