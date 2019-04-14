import resource from 'resource-router-middleware';
import aqp from 'api-query-params';
import Media from '../models/media.model';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id : 'profile',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	async load(req, id, callback) {
		// console.log(req.headers['x-token'])
		try {
			const user = await jwt.verify(req.headers['x-token'], config.jwtSecret)
			let profile = await User.findOne({'_id': user.id}).select({ info: 1 })

			// Set default avatar image
			profile.info.avatar = profile.info.avatar || config.uploads.avatar
			
			callback('', profile);
		}	
		catch (err) {
			let	err = 'Not found';
			callback(err, '');
		}

		// let facet = facets.find( facet => facet.id===id ),
		// callback(err, media);
	},

	/** GET / - List all entities */
	index({ query, profile }, res) {
		const { filter, skip, limit, sort, projection } = aqp(query, {
			skipKey: 'page',
		});

		const page = (skip) ? skip : 1;
		const perPage = (limit && limit <= 100) ? limit : 50;

		Media.paginate(filter, { select: projection, sort:sort , page: page, limit: perPage, }).then((result) => {
			res.status(200).json(result)
		}).catch((err) => {
			res.status(500).json(err)
		})
	},

	/** POST / - Create a new entity */
	create({ body }, res) {
		body.id = facets.length.toString(36);
		facets.push(body);
		res.json(body);
	},

	/** GET /:id - Return a given entity */
	read({ profile }, res) {
		res.json(profile);
	},

	/** PUT /:id - Update a given entity */
	update({ profile, body, params }, res) {
		console.log(body);
		// console.log(params.profile);
		User.update({ '_id': params.profile }, {
			$set: {
			  	info: {
					name: body.name,
					avatar: body.avatar,
					introduction: body.introduction
				},
			}
		},
		function (err, place) {
			console.log(place);
		})
		res.sendStatus(204);
	}
});
