/// <reference path="interfaces/ISettingsSchema.d.ts" />

export function isSettings(settings: any): settings is ISettingsSchema {
	if (typeof settings != 'object') return false;
	if (typeof settings.host != 'string') return false;
	if (typeof settings.port != 'number') return false;
	if (typeof settings.serviceName != 'string') return false;
	return true;
}