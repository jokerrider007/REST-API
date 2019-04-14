import { Router } from 'express';
import { authGuard } from '../lib/util'
import acl from 'express-acl';
import jwt from 'jsonwebtoken'

export default ({ config, db }) => {
	let routes = Router();

	// add middleware here
	routes.use(authGuard(config));
	// routes.use(function (req, res, next) {
	// 	if (!!req.headers.authorization) {
	// 		let bearer = req.headers.authorization.split(' ');
	// 		let token = bearer[1];
	// 		if (token) {
	// 			jwt.verify(token, config.jwtSecret, function(err, decoded) {
	// 				if (err) {
	// 					return res.send(err);
	// 				} else {
	// 					req.decoded = decoded;
	// 					next();
	// 				}
	// 			});
	// 		}
	// 	} else {
	// 		next();
	// 	}
	// });

	routes.use(acl.authorize);

	return routes;
}
