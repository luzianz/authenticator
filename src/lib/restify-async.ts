import * as restify from 'restify';

export class AsyncListener {
	constructor(private server: restify.Server){}
	public async listenAsync(port, hostAddr): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.server.on('error', err => reject(err));
			this.server.listen(port, hostAddr, () => resolve());
		});
	}
}