/// <reference path="../interfaces/ICancellationToken.d.ts" />

export class CancellationTokenSource implements ICancellationToken {
	private callbacks: Array<() => void>;
	private _isCancelled: boolean;

	constructor() {
		this.callbacks = [];
		this._isCancelled = false;
	}

	public cancel() {
		if (!this._isCancelled) {
			this._isCancelled = true;
			for (const callback of this.callbacks) {
				callback();
			}
		}
	}

	public register(callback: () => void) {
		if (callback) {
			this.callbacks.push(callback);
		}
	}

	public get isCancelled(): boolean {
		return this._isCancelled;
	}
}

export async function setTimeoutAsync(delay: number, cancellationToken?: ICancellationToken): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const timer = setTimeout(function () {
			resolve();
		}, delay);

		if (cancellationToken) {
			cancellationToken.register(() => {
				clearTimeout(timer);
				resolve();
			});
		}
	});
}