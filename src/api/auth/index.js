import { Router } from 'express';

import login from './login';
import register from './register';
import logout from './logout';
import status from './status';

export default ({ config, db }) => {
	let auth = Router()

    auth.use('/login', login({ config, db }))

    auth.use('/register', register({ config, db }))

    auth.use('/logout', logout({ config, db }))

    auth.use('/info', status({ config, db }))

	return auth;
}