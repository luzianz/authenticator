/// <reference path="interfaces/ISettingsSchema.d.ts" />

type EnvNames = 'SERVICENAME' | 'PORT' | 'HOST';

export default class AppSettings implements ISettingsSchema
{
	private readonly appSettingsFilePath: string;
	private readonly settings;

	constructor() {
		const appSettingsFileName = 'app-settings.json';
		this.appSettingsFilePath = `${process.cwd()}/${appSettingsFileName}`;
		try {
			this.settings = require(this.appSettingsFilePath);
		} catch(error) {
			this.settings = {};
		}
	}

	public get serviceName() {
		return this.getValue('SERVICENAME', 'serviceName');
	}

	public get port() {
		return this.getValueOrDefault('PORT', 'port', 80);
	}

	public get host() {
		return this.getValueOrDefault('HOST', 'host', undefined);
	}

	private getValueOrDefault<P extends keyof ISettingsSchema, T>(environmentVariableName: EnvNames, propertyName: P, defaultValue: T): T {
		try {
			return this.getValue(environmentVariableName, propertyName);
		} catch (error) {
			if (error instanceof ReferenceError) {
				return defaultValue;
			} else {
				throw error;
			}
		}
	}

	private getValue<P extends keyof ISettingsSchema>(environmentVariableName: EnvNames, propertyName: P) {
		if (typeof process.env[environmentVariableName] != 'undefined') {
			return process.env[environmentVariableName];
		} else if (typeof this.settings[propertyName] != 'undefined') {
			return this.settings[propertyName];
		} else {
			throw this.getError(environmentVariableName, propertyName);
		}
	}

	private getError<P extends keyof ISettingsSchema>(environmentVariableName: EnvNames, propertyName: P) {
		const msg = `${propertyName} is neither set in ${this.appSettingsFilePath}, nor environment variable \$${environmentVariableName}`;
		return new ReferenceError(msg);
	}
}