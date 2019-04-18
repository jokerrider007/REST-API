import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate';
import mongoosePaginate from 'mongoose-paginate';


// Define schema
const Schema = mongoose.Schema;

const mediaSchema = new Schema({
    title: {
        romaji: String,
        english: String,
        native: String,
        userPreferred: String,
    },
    startDate: {
        year: Number,
        month: Number,
        day: Number
    },
    endDate: {
        year: Number,
        month: Number,
        day: Number
    },
    coverImage: Object,
    genres: Object,
    season: String,
    type: String,
    format: String,
    status: String,
    episodes: Number,
    duration: Number,
    isAdult: Boolean,
    description: String,
    countryOfOrigin: String,
    source: String,
    enable: Boolean,
    synonyms: Array,
    trailer: Object
}, { minimize: false })

mediaSchema.plugin(mongooseAggregatePaginate);
mediaSchema.plugin(mongoosePaginate);

const Media = mongoose.model('Media', mediaSchema );

export default Media
