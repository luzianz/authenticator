/// <reference path="../interfaces/IKeysSchema.d.ts" />

function getSecretsFilePath(userSecretsId: string) {
	if (process.platform == 'win32') {
		return `${process.env.APPDATA}\\microsoft\\UserSecrets\\${userSecretsId}\\secrets.json`;
	} else {
		return `${process.env.HOME}/.microsoft/usersecrets/${userSecretsId}/secrets.json`;
	}
}

export function getSecrets(): IKeysSchema {
	const pkg = require(process.cwd() + '/package.json');
	const secretsFilePath = getSecretsFilePath(pkg.userSecretsId);
	return require(secretsFilePath);
}