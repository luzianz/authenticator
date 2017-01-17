/// <reference path="interfaces/ISettingsSchema.d.ts" />

import * as restify from 'restify'; // http://restify.com
import { readFileAsync } from './lib/fs-async';
import { AsyncListener } from './lib/restify-async';
import { setTimeoutAsync } from './lib/other-async';
import { configureEndpoints } from './rest-endpoints';
import AppSettings from './AppSettings';

async function main() {
	if (process.env.NODE_ENV == 'production' && typeof process.env.JWTPRESHAREDKEY == 'undefined') {
		const msg = 'environment variable JWTPRESHAREDKEY is missing while running in production';
		throw new Error(msg);
	}

	const appSettings = new AppSettings();

	const server = restify.createServer({ name: appSettings.serviceName });

	process.once('SIGINT', () => {
		server.close();
		console.log('service stopped');
	});

	configureEndpoints(appSettings.serviceName, server);

	const listener = new AsyncListener(server);

	await listener.listenAsync(appSettings.port, appSettings.host);
	console.log(`service started: ${server.name} listening at ${server.url}`);
}

main().then(
	result => null,
	reason => console.error(reason));