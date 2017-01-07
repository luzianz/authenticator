import * as jwt from 'jsonwebtoken';

export function signAsync(payload: string | Buffer | Object, secretOrPrivateKey: string | Buffer, options?: jwt.SignOptions): Promise<string> {
	return new Promise((resolve, reject) => {
		jwt.sign(payload, secretOrPrivateKey, options, (err, result) => {
			if (err) reject(err);
			else {
				resolve(result);
			}
		});
	});
}