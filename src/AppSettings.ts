/// <reference path="interfaces/ISettingsSchema.d.ts" />

type EnvNames = 'SERVICENAME' | 'PORT' | 'HOST';

export default class AppSettings implements ISettingsSchema
{
	public get serviceName() {
		return this.getValue('SERVICENAME', 'authenticator');
	}

	public get port() {
		return this.getValue('PORT', 80);
	}

	public get host() {
		return this.getValue('HOST');
	}

	private getValue<P extends keyof ISettingsSchema, T>(environmentVariableName: EnvNames, defaultValue?: T) {
		if (typeof process.env[environmentVariableName] != 'undefined') {
			return process.env[environmentVariableName];
		} else {
			return defaultValue;
		}
	}
}