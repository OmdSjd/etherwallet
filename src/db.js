var mongoose   = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/local')
var db = mongoose.connection;
export default callback => {
	// connect to a database if needed, then pass it to `callback`:
	callback(
        db.on('connected', function() {
            console.log('DB CONNECTED');
        })
	);
}