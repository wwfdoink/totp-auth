import forge from 'node-forge';

const SALT_SIZE = 16;
export const encrypt = (textToEncrypt: string, userPassword: string): string => {
	const salt = forge.random.getBytesSync(SALT_SIZE);
	const iv = forge.random.getBytesSync(SALT_SIZE);

	const key = forge.pkcs5.pbkdf2(userPassword, salt, 100000, 256 / 8, 'sha256');
	const cipher = forge.cipher.createCipher('AES-CBC', key);

	cipher.start({ iv: iv });
	cipher.update(forge.util.createBuffer(textToEncrypt));
	cipher.finish();

	return forge.util.encode64(`${salt}${iv}${cipher.output.bytes()}`);
};

export const decrypt = async (textToDecrypt: string, userPassword: string): Promise<string> => {
	const encrypted = forge.util.binary.base64.decode(textToDecrypt);

	const saltLength = SALT_SIZE;
	const ivLength = SALT_SIZE;

	const salt = forge.util.createBuffer(encrypted.slice(0, saltLength));
	const iv = forge.util.createBuffer(encrypted.slice(0 + saltLength, saltLength + ivLength));

	const key: string = await new Promise((resolve, reject) => {
		forge.pkcs5.pbkdf2(userPassword, salt.bytes(), 100000, 256 / 8, 'sha256', (err, derivedKey) => {
			if (err) {
				return reject(err);
			}
			return resolve(derivedKey);
		});
	});
	const decipher = forge.cipher.createDecipher('AES-CBC', key);

	decipher.start({ iv: iv });
	decipher.update(forge.util.createBuffer(encrypted.slice(saltLength + ivLength)));
	decipher.finish();

	return decipher.output.toString();
};
