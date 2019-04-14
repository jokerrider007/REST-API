import mongoose from 'mongoose';

export default callback => {
	
	mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

	// Get Mongoose to use the global promise library
	mongoose.Promise = global.Promise;
	//Get the default connection
	const db = mongoose.connection;

	// connect to a database if needed, then pass it to `callback`:
	callback(db);
}
