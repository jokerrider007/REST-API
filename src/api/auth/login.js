import resource from 'resource-router-middleware';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt-nodejs'
import User from '../../models/user.model';

export default ({ config, db }) => resource({
	
	/** POST / - Create a new entity */
	create({ body }, res) {
		if (!body.username || !body.password) {
			return res.status(400).json({ message: 'Missing required fields' })
		}
		User.findOne({ username: body.username })
		.then(user => {
			if(!user) return res.status(400).json({ message: 'No user' })
			bcrypt.compare(body.password, user.password, (err, result) => {
				if(result) {
					const token = jwt.sign({id: user._id, role: 'admin'}, config.jwtSecret, { expiresIn: '1h' })
					return res.status(200).json({ message: 'ok', token })
				}
				else {
					return res.status(400).json({ message: 'Bad password' })
				}
			})
		})
		.catch((err) => {
			return res.status(400).json(err)
		})
	}
});
