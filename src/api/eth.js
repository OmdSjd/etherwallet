import resource from 'resource-router-middleware';
import eth from '../models/eth';
var Web3 = require('web3');
var web3 = new Web3(
    new Web3.providers.HttpProvider('https://mainnet.infura.io/<API-KEY>')
);
function Ethereum(a,pk) {
    this.publicKey = a;
    this.privateKey = pk;
}
export default ({ config, db }) => resource({

    /** Property name to store preloaded entity on `request`. */
    id : 'eth',

    /** GET / - List all entities */
    index({ params }, res) {
        db.collection("ethAddress").find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log("All addresses printed");
            res.json(result);
            //db.close();
        });
    },
    /** POST / - Create a new entity */
    create({ body }, res) {
        var wallet = web3.eth.accounts.create();
        var eth = new Ethereum(wallet.address, wallet.privateKey);
        db.collection("ethAddress").insertOne(eth, function(err, res) {
            if (err) throw err;
            console.log("Eth created");
            //db.close();
        });
        res.json(eth);
    },
    /** GET /:id - Return a given entity */
    read({ eth }, res) {
        var query = eth[0];
        db.collection("ethAddress").find(query).toArray(function(err, result) {
            if (err) throw err;
            //console.log("Acc with publicKey: " + eth.publicKey  + " printed");
            res.json(result);
            //db.close();
        });
    },
    /** For requests with an `id`, you can auto-load the entity.
     *  Errors terminate the request, success sets `req[id] = data`.
     */
    load(req, id, callback) {
        var query = { "publicKey" : id};
        db.collection("ethAddress").find(query).toArray(function(err, result) {
            if (err) throw err;
            let eth = result;
            callback(err, eth);
            //db.close();
        });
    },
});
