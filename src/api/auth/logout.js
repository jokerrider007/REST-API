import resource from 'resource-router-middleware';
import jwt from 'jsonwebtoken'

export default ({ config, db }) => resource({
	
	/** POST / - Create a new entity */
	create({ body }, res) {
		res.status(200).json({})
	}

});
