import * as restify from 'restify';
import * as claims from './claims';

export function configureEndpoints(serviceName: string, server: restify.Server) {
	const appRootUrl = `/api/${serviceName}`;
	claims.configureEndpoints(server, appRootUrl);
}