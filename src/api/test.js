import resource from 'resource-router-middleware';
import facets from '../models/facets';
import Test from '../models/test';
import User from '../models/user.model';
import aqp from 'api-query-params';


export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id : 'facet',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	load(req, id, callback) {
			const { filter, skip, limit, sort, projection } = aqp(req.query);

			console.log(projection);
		
			User.find({}, (err, result) => {
				callback(err, result);
			}).select(projection)
			// Test.find({}, async (err, result) => {
			// 	callback(err, result);
			// })
	},

	/** GET / - List all entities */
	async index({ params }, res) {
		res.json(await Test.find());
		// const result = await Test.find()
		// res.json(await Test.find());
		// Test.find({}, (err, result) => {
		// 	res.json(result);
		// })
	},

	/** POST / - Create a new entity */
	create({ body }, res) {
		const ass = new Test({ msg: 'awesome' });
		ass.save().then(function(result){
			res.json(result);
		})
		// body.id = facets.length.toString(36);
		// facets.push(body);
		// res.json(body);
	},

	/** GET /:id - Return a given entity */
	read({ facet }, res) {
		res.json(facet);
	},

	/** PUT /:id - Update a given entity */
	update({ facet, body }, res) {
		for (let key in body) {
			if (key!=='id') {
				facet[key] = body[key];
			}
		}
		res.sendStatus(204);
	},

	/** DELETE /:id - Delete a given entity */
	delete({ facet }, res) {
		facets.splice(facets.indexOf(facet), 1);
		res.sendStatus(204);
	}
});
