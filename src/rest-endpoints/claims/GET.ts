/// <reference path="../../interfaces/IKeysSchema.d.ts" />
/// <reference path="../../interfaces/IClaims.d.ts" />
/// <reference path="../../interfaces/ITokenResponse.d.ts" />

import * as restify from 'restify';

import { signAsync } from '../../lib/jwt-async';
import { getUserByEmailAsync } from '../../data-access';
import { compareAsync } from '../../lib/bcrypt-async';
import { getSecrets } from '../../lib/secrets';
import Lazy from '../../lib/Lazy';

const jwtPresharedKey = new Lazy(() => {
	if (process.env.NODE_ENV == 'development') {
		return getSecrets().JwtPresharedKey;
	} else if (process.env.NODE_ENV == 'production') {
		return process.env.JWTPRESHAREDKEY;
	} else {
		return undefined;
	}
});

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
			email: user.email
		};
		const minute = 60;
		const hour = minute * 60;
		const day = hour * 24;
		const response = await signAsync(claims, jwtPresharedKey.value, {
			algorithm: 'HS256', 
			issuer: req.absoluteUri('/'),
			audience: req.absoluteUri('/'),
			expiresIn: day
		});

		res.send(200, response);
	} else {
		throw new restify.NotAuthorizedError('invalid authorization header');
	}
}

export default function(req: restify.Request, res: restify.Response, next: restify.Next) {
	handleHttpRequestAsync(req, res, next).catch(reason => next(reason));
}