import * as fs from 'fs'

export function readFileAsync(filename: string): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		fs.readFile(filename, (err, data) => {
			if (err) reject(err);
			else {
				resolve(data);
			}
		});
	});
}