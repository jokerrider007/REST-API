import mongoose from 'mongoose';

// Define schema
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    type: String,
    name: String
})

// mediaSchema.plugin(mongoosePaginate);

const Image = mongoose.model('Image', imageSchema );

export default Image
  