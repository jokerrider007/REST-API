import resource from 'resource-router-middleware';
import jwt from 'jsonwebtoken';
import User from '../../models/user.model';

export default ({ config, db }) => resource({
	
	/** GET / - List all entities */
	async index({ query, headers }, res) {
		// let bearer = headers.authorization.split(' ');
		// let token = bearer[1];
		const token = query.token
		try  {
			const user = await jwt.verify(token, config.jwtSecret)
			console.log(user)
			const profile = await User.findOne({'_id': user.id}).select({ info: 1 })
			// console.log(profile.avatar);
			return res.status(200).json({ 
				isLogged: true,
				roles: 'admin',
				introduction: '我是超级管理员',
				avatar: profile.info.avatar || config.uploads.avatar,
				// avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
				name: 'Super Admin'
			})
		} catch (err) {
			return res.status(401).json({ message: 'Not logged', isLogged: false })
		}
	}

});
