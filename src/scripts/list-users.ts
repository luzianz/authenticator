import { getUsersAsync } from '../data-access';

getUsersAsync().then(
	users => console.log(JSON.stringify(users)),
	error => console.error(error));