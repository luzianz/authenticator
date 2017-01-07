if (process.argv.length > 3) {
	const email = process.argv[2];
	const password = process.argv[3];
	const authorizationArg = new Buffer(`${email}:${password}`).toString('base64');
	console.log(`Authorization: Basic ${authorizationArg}`);
} else {
	console.error('no');
}