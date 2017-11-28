var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EthSchema   = new Schema({
    publicKey: String,
    privateKey: String
});
module.exports = mongoose.model('ethAddress', EthSchema);