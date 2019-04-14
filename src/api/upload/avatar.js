import resource from 'resource-router-middleware';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

// import Utility.
import { authGuard } from '../../lib/util';

const uploads = multer({ 
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
           cb(null, path.join(__dirname, '../../uploads/avatars'))
        },
        filename: (req, file, cb) => {
            // console.log(req.body.oldAvatar)
            // let customFileName = crypto.randomBytes(18).toString('hex'),
            let customFileName = req.body.oldAvatar,
            fileExtension = file.originalname.split('.')[1] // get file extension from original file name
            cb(null, customFileName + '.' + fileExtension)
        }
    })
})

export default ({ config, db }) => resource({

    middleware: [
        // uploads.any()   // any multer upload options
        uploads.single(`avatar`)
        // uploads.fields([{ name: 'avatar', maxCount: 1 }])
    ],

    id : 'avatar',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	async load(req, id, callback) {
		// let facet = facets.find( facet => facet.id===id ),
        // 	err = facet ? null : 'Not found';
        let avatar = id,
			err = null;
		callback(err, avatar);
	},

    /** GET /:id - Return a given entity */
	read({ avatar }, res) {
		res.status(200).sendFile(path.join(__dirname, `../../uploads/avatars/${avatar}`));
	},

	/** POST / - Create a new entity */
	// async create({ body, headers, file }, res) {
    //     try  {
    //         console.log(file)
    //         res.status(200).json(file);
    //     }
    //     catch (err) {
    //         res.status(500).json(err);
    //     }
    // },

    create: [ authGuard(config),
        async ( {body, headers, file}, res ) => {
            try  {
                console.log(body);
                // if (body.oldAvatar != '1') {
                //     const avatarPath = path.join(__dirname, `../../uploads/avatars/${body.oldAvatar}`)
                //     fs.unlink(avatarPath, (err) => {
                //         if (err) throw err;
                //     });
                // }
                res.status(200).json(file);
            }
            catch (err) {
                res.status(500).json(err);
            }
        }
    ],

    /** DELETE /:id - Delete a given entity */
	delete: [ authGuard(config),
        async ({ avatar }, res) => {
            try  {
                console.log(avatar);
                // let avatarURL = avatar.split('http://localhost:8080/api/upload/avatar/');
                // let filename = avatarURL[1];
                const avatarPath = path.join(__dirname, `../../uploads/avatars/${avatar}`)
                fs.unlink(avatarPath, (err) => {
                    if (err) throw err;
                });
                res.sendStatus(204);
            } catch (err) {
                res.status(500).json(err);
            }
        }
    ]
});
