interface ICancellationToken {
	register(callback: () => void);
	isCancelled: boolean;
}