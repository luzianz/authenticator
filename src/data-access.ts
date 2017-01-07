/// <reference path="interfaces/IUser.d.ts" />
/// <reference path="../node_modules/sqlite-promised/build/sqlite-promised.d.ts" />

import * as sqlitep from 'sqlite-promised';

const dbFilePath = `data/authenticator.sqlite3`;
const userByEmailSql = 'SELECT * FROM "users" WHERE "email" = ?';

export async function getUserByEmailAsync(email: string): Promise<IUser> {
	const db = await sqlitep.openDatabaseAsync(dbFilePath);
	const users = await sqlitep.queryAndCloseAsync<IUser>(db, userByEmailSql, email);

	return users.length > 0 ? users[0] : null;
}

export async function getUsersAsync(): Promise<IUser[]> {
	const db = await sqlitep.openDatabaseAsync(dbFilePath);
	return await sqlitep.queryAndCloseAsync<IUser>(db, 'SELECT * FROM "users"');
}