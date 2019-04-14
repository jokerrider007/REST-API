import { Router } from 'express';
import resource from 'resource-router-middleware';
import path from 'path';

// import Utility.
import { authGuard } from '../../lib/util';

// import Childroute
import cover from './cover';
import avatar from './avatar';



export default ({ config, db }) => {
	let upload = Router()
	upload.use('/avatar', avatar({ config, db }))
	
	// upload.use('/cover', [authGuard(config)], cover({ config, db }))
	upload.use('/cover', cover({ config, db }))

	upload.use('/cover/:folder',
		resource({
			id: 'cover',
			mergeParams: true,
			load(req, id, callback) {
				// comments.find({ id, photo_id:photo })
				//     .then(callback.bind(null,null))
				//     .catch(callback);
				let cover = id,
				err = null;
				callback(err, cover);
			},

			async read({params}, res) {
				res.status(200).sendFile(path.join(__dirname, `../../uploads/covers/${params.folder}/${params.cover}`));
			}
		})
	)

	return upload;
}