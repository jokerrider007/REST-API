import { version } from '../../package.json';
import { Router } from 'express';
import acl from 'express-acl';
import jwt from 'jsonwebtoken'

import roles from './roles';
import facets from './facets';
import test from './test';
import auth from './auth';
import media from './media';
import upload from './upload';
import profile from './profile';

export default ({ config, db }) => {
	let api = Router();

	// mount the auth resource
	api.use('/auth', auth({ config, db }));

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// mount the facets resource
	api.use('/test', test({ config, db }));

	// mount the facets resource
	api.use('/roles', roles({ config, db }));

	// mount the facets resource
	api.use('/media', media({ config, db }));

	// mount the facets resource
	api.use('/upload', upload({ config, db }));

	// mount the facets resource
	api.use('/profile', profile({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
