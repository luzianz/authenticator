// https://www.npmjs.com/package/bcrypt-nodejs

import * as bcrypt from 'bcrypt-nodejs';

export function hashAsync(data: string, salt: string, onProgress: () => void): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		bcrypt.hash(data, salt, onProgress, function(err, hash) {
			if (err) reject(err);
			else resolve(hash);
		});
	});
}

export function genSaltAsync(rounds: number): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		bcrypt.genSalt(rounds, function(err, salt) {
			if (err) reject(err);
			else resolve(salt);
		});
	});
}

export function compareAsync(plainText: string, cypherText: string): Promise<boolean> {
	return new Promise<boolean>((resolve, reject) => {
		bcrypt.compare(plainText, cypherText, function(err, isValid) {
			if (err) reject(err);
			else resolve(isValid);
		});
	});
}