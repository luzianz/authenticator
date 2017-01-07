/// <reference path="../../node_modules/sqlite-promised/build/sqlite-promised.d.ts" />

import * as sqlitep from 'sqlite-promised';
import * as randomstring from 'randomstring';
import { readFileAsync } from '../lib/fs-async';
import { genSaltAsync, hashAsync, compareAsync } from '../lib/bcrypt-async'

async function initAsync() {
	const email = process.argv.length > 2 ? process.argv[2] : 'admin@localhost';
	const password = randomstring.generate({ length: 32, charset: 'alphanumeric' });
	const salt = await genSaltAsync(32);
	const hash = await hashAsync(password, salt, null);
	const params = {
		$email: email,
		$bcrypt_password: hash
	};
	const usersTableSqlBuffer = await readFileAsync('src/sql/users.sql');
	const insertUserSqlBuffer = await readFileAsync('src/sql/create-user.template.sql');
	
	const db = await sqlitep.openDatabaseAsync('data/authenticator.sqlite3');
	await sqlitep.runAndFinalizeAsync(db, usersTableSqlBuffer.toString());
	console.log('users table created');
	await sqlitep.runAndCloseAsync(db, insertUserSqlBuffer.toString(), params);
	console.log('user created');
	console.log(`\temail: ${email}`);
	console.log(`\tpassword: ${password}`);
	const authorizationArg = new Buffer(`${email}:${password}`).toString('base64');
	console.log(`\tAuthorization: Basic ${authorizationArg}`);
}

initAsync().then(
	result => console.log('done'),
	error => console.error(error)
);