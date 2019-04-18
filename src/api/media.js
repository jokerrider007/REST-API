import resource from 'resource-router-middleware';
import aqp from 'api-query-params';
import Media from '../models/media.model';

// import Utility.
import { authGuard } from '../lib/util';

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id : 'media',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	async load(req, id, callback) {
		try {
      const media = await Media.findOne({'_id': id})
			let	err = media ? null : 'Not found';
			callback(err, media);
		}
		catch (err) {
      console.log(err)
			let	err = media ? null : 'Not found';
			callback(err, '');
		}

		// let facet = facets.find( facet => facet.id===id ),
		// callback(err, media);
	},

	/** GET / - List all entities */
	index({ query, user }, res) {
		const { filter, skip, limit, sort, projection } = aqp(query, {
			skipKey: 'page',
		});

		console.log(user);

		// const search = { 'title.romaji': { $regex: '.*' + filter.title + '.*' }}
		const page = (skip) ? skip : 1;
		const perPage = (limit && limit <= 100) ? limit : 50;
		// console.log(search);

		Media.paginate(filter, { select: projection, sort:sort , page: page, limit: perPage, }).then((result) => {
			// var isInObject = ('enabled' in myObject);
			// console.log(result)
			res.status(200).json(result)
		}).catch((err) => {
			res.status(500).json(err)
    })
  },

	/** POST / - Create a new entity */
	create: [ authGuard(config),
    async ({ body }, res) => {
      const media = new Media({
        title: {
          romaji: '',
          english: '',
          native: '',
          userPreferred: '',
        },
        startDate: {
          year: 0,
          month: 0,
          day: 0
        },
        endDate: {
          year: 0,
          month: 0,
          day: 0
        },
        coverImage: {},
        genres: [],
        season: '',
        type: '',
        format: '',
        status: '',
        episodes: 0,
        duration: 0,
        isAdult: false,
        description: '',
        countryOfOrigin: '',
        source: '',
        enable: false
      })
      const savedMedia = await media.save()
      res.json(savedMedia);
    }
  ],

	/** GET /:id - Return a given entity */
	read: [ authGuard(config),
    ({ media }, res) => {
      console.log(media);
      res.status(200).json(media);
    }
  ],

	/** PUT /:id - Update a given entity */
	async update({ media, body }, res) {
		// const mediaObject = {
		// 	title
		// }
		await Media.updateOne({ '_id': body.id }, {
			$set: body
		})
		console.log(body);
		res.sendStatus(204);
	},

	/** DELETE /:id - Delete a given entity */
	async delete({ media }, res) {
		await Media.deleteOne({ '_id': media });
		res.sendStatus(204);
	}
});
