import resource from 'resource-router-middleware';
import User from '../../models/user.model';

export default ({ config, db }) => resource({

	/** POST / - Create a new entity */
	async create({ body }, res) {
		const user = new User(body);
		try {
			const savedUser = await user.save()
			res.status(200).json(savedUser);
		}
		catch (err) {
			res.status(500).json(err);
		}
	}
});
