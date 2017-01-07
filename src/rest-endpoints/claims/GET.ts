/// <reference path="../../interfaces/IKeysSchema.d.ts" />
/// <reference path="../../interfaces/IClaims.d.ts" />
/// <reference path="../../interfaces/ITokenResponse.d.ts" />

// POST /api/sessions

import * as restify from 'restify';

import { signAsync } from '../../lib/jwt-async';
import { getUserByEmailAsync } from '../../data-access';
import { compareAsync } from '../../lib/bcrypt-async';
import { dateAdd } from '../../lib/datetime';

const keys: IKeysSchema = require('../../../secrets/keys.json');

function isAuthHeaderValid(req: restify.Request): boolean {
	if (!req.authorization) return false;
	if (typeof req.authorization.scheme != 'string') return false;
	if (req.authorization.scheme.toLowerCase() != 'basic') return false;
	if (!req.authorization.basic) return false;
	if (typeof req.authorization.basic.username != 'string') return false;
	if (typeof req.authorization.basic.password != 'string') return false;
	return true;
}

async function authenticateAsync(email: string, password: string): Promise<IUser> {
	const user = await getUserByEmailAsync(email);

	if (!user) {
		throw new restify.NotFoundError();
	}

	const isAuthenticated = await compareAsync(password, user.bcrypt_password);

	if (!isAuthenticated) {
		throw new restify.InvalidCredentialsError();
	}

	return user;
}

async function handleHttpRequestAsync(req: restify.Request, res: restify.Response, next: restify.Next) {
	if (isAuthHeaderValid(req)) {
		const user = await authenticateAsync(req.authorization.basic.username, req.authorization.basic.password);
		const claims: IClaims = {
			authenticationIssuer: req.url,
			email: user.email,
			expiration: dateAdd(new Date(), 'day', 1)
		};
		const response: ITokenResponse = {
			token: await signAsync(claims, keys.presharedKey, { algorithm: 'HS256' })
		};
		res.send(200, response);
	} else {
		throw new restify.NotAuthorizedError('invalid authorization header');
	}
}

export default function(req: restify.Request, res: restify.Response, next: restify.Next) {
	handleHttpRequestAsync(req, res, next).catch(reason => next(reason));
}