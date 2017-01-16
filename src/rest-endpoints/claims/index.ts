import * as restify from 'restify';
import getClaims from './GET';

export function configureEndpoints(server: restify.Server, appRootUrl: string) {
	const url = `${appRootUrl}/claims`;
	server.get(url, restify.authorizationParser(), getClaims);
}