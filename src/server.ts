/// <reference path="interfaces/ISettingsSchema.d.ts" />

import * as restify from 'restify'; // http://restify.com
import { readFileAsync } from './lib/fs-async';
import getClaims from './rest-endpoints/claims/GET';
import { AsyncListener } from './lib/restify-async';
import { isSettings } from './type-checkers';
import { setTimeoutAsync } from './lib/other-async';

const settingsFilePath = '../app-settings.json';
const settings = require(settingsFilePath);

async function main() {
	if (!isSettings(settings)) {
		const errMsg = `Not all required properties are present in ${settingsFilePath}. Refer to ISettingsSchema.d.ts`;
		throw new Error(errMsg);
	}

	let port = settings.port;

	const server = restify.createServer({ name: settings.serviceName });

	process.once('SIGINT', () => {
		server.close();
		console.log('service stopped');
	});

	server.get(`/api/${settings.serviceName}/claims`, restify.authorizationParser(), getClaims);

	const listener = new AsyncListener(server);

	let retries = 5;

	do {
		try {
			await listener.listenAsync(port, settings.host);
			console.log(`service started: ${server.name} listening at ${server.url}`);
			break;
		} catch (err) {
			if (err.code == 'EADDRINUSE') {
				console.log(`port {port} is in use`);
				await setTimeoutAsync(200);
				retries--;
				port++;
			} else {
				console.error(err);
				break;
			}
		}
	} while (retries > 0);
}

main().then(
	result => null,
	reason => console.error(reason));