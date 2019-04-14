import mongoose from 'mongoose';

// Define schema
const Schema = mongoose.Schema;

const TestModelSchema = new Schema({
msg: String
});

// Compile model from schema
const SomeModel = mongoose.model('TestModel', TestModelSchema );

export default SomeModel;
