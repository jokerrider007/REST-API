import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

/**	Creates a callback that proxies node callback style arguments to an Express Response object.
 *	@param {express.Response} res	Express HTTP Response
 *	@param {number} [status=200]	Status code to send on success
 *
 *	@example
 *		list(req, res) {
 *			collection.find({}, toRes(res));
 *		}
 */
export function toRes(res, status=200) {
	return (err, thing) => {
		if (err) return res.status(500).send(err);

		if (thing && typeof thing.toObject==='function') {
			thing = thing.toObject();
		}
		res.status(status).json(thing);
	};
}

export const authGuard = (config) => {
	return (req, res, next) => {
		if(req.headers.authorization) {
			let bearer = req.headers.authorization.split(' ');
			let token = bearer[1];
	
			jwt.verify(token, config.jwtSecret, function(err, decoded) {
				req.decoded = decoded;
				next()
			});
		} else if(req.headers['x-token']) {
			console.log('x-token')
			jwt.verify(req.headers['x-token'], config.jwtSecret, function(err, decoded) {
				// console.log(decoded)
				req.decoded = decoded;
				next()
			});
		} else {
			next()
			// res.json({'err': 'error authorization'});
		}
	}
}

export const checkCoverDir = (config) => {
	return (req, res, next) => {
		console.log(req.body.id)
		const dir =  path.join(__dirname, `../uploads/covers/${req.body.id}`)
		if (!fs.existsSync(dir)){
			console.log('if');
			fs.mkdirSync(dir)
			next()
		} else {
			console.log('else');
			next()
		}
	}
}
