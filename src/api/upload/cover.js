import resource from 'resource-router-middleware';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

import Media from '../../models/media.model';
import Image from '../../models/image.model';

// import Utility.
import { checkCoverDir } from '../../lib/util';

const uploads = multer({ 
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const dir =  path.join(__dirname, `../../uploads/covers/${req.body.id}`)
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir)
            }
            cb(null, path.join(__dirname, `../../uploads/covers/${req.body.id}`))
            // cb(null, path.join(__dirname, '../../uploads/covers'))
        },
        filename: (req, file, cb) => {
            let customFileName = crypto.randomBytes(18).toString('hex'),
            fileExtension = file.originalname.split('.')[1] // get file extension from original file name
            cb(null, customFileName + '.' + fileExtension)
        }
    })
})


export default ({ config, db }) => resource({

    mergeParams: true,

    // middleware: [
    //     // uploads.any()   // any multer upload options
    //     uploads.single(`cover`)
    //     // uploads.fields([{ name: 'cover', maxCount: 1 }])
    // ],

    id : 'cover',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	async load(req, id, callback) {
		// let facet = facets.find( facet => facet.id===id ),
        // 	err = facet ? null : 'Not found';
        let cover = id,
			err = null;
		callback(err, cover);
	},

    read: [
        resource({
            id: 'comment',
            mergeParams: true,
            load(req, id, callback) {
                const { photo } = req.params;
                console.log(req.params);
                // comments.find({ id, photo_id:photo })
                //     .then(callback.bind(null,null))
                //     .catch(callback);
                callback.bind(null,null)
            },

            async list(req, res) {
                // req.photo. // The photo ID
                res.json({'Hello': 'asdfasdfasdfasdf'});
            }
        })
    ],    

	/** POST / - Create a new entity */
	create: [ checkCoverDir(config), uploads.single(`cover`),
        async ({ body, headers, file }, res) => {
            if(headers.authorization) {
                let bearer = headers.authorization.split(' ');
                let token = bearer[1];
                try  {
                    await jwt.verify(token, config.jwtSecret)
                    // const image = new Image({
                    //     type: file.fieldname,
                    //     name: file.filename
                    // });
                    // const savedImage = await image.save()

                    const updatedCover = await Media.updateOne({ '_id': body.id }, {
                        $set: {
                            coverImage: {
                                cover: {
                                    type: file.fieldname,
                                    name: file.filename
                                }
                            },
                        }
                    })
                    console.log(updatedCover)
                    res.status(200).json(file);
                }
                catch (err) {
                    res.status(500).json(err);
                }
            }else{
                res.status(401).json({'err': 'error authorization'});
            }
        }
    ],

    /** DELETE /:id - Delete a given entity */
	asyncdelete({ cover }, res) {
        const coverPath = path.join(__dirname, `../../uploads/${cover}`)
        fs.unlink(coverPath, (err) => {
            if (err) throw err;
        });
		res.sendStatus(204);
	}
});
