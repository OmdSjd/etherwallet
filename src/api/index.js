import { version, name} from '../../package.json';
import { Router } from 'express';
import eth from './eth';
const Tx = require('ethereumjs-tx');
const Web3 = require('web3');
var web3 = new Web3(
    new Web3.providers.HttpProvider('https://mainnet.infura.io/<api-key>')
);

function Ethereum(a,pk) {
    this.publicKey = a;
    this.privateKey = pk;
}
export default ({ config, db }) => {
	let api = Router();

    api.use('/eth', eth({ config, db }));
	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({name, version });
	});
	api.get('/create', (reg,res)=>{
        var wallet = web3.eth.accounts.create();
        var eth = new Ethereum(wallet.address, wallet.privateKey);
        db.collection("ethAddress").insertOne(eth, function(err, res) {
            if (err) throw err;
            console.log("Eth created");
            //db.close();
        });
        res.json(eth);
    });
    api.get('/balance/:addr',(req,res)=>{
        web3.eth.getBalance(req.params.addr).then(function (value) {
            let balance = web3.utils.fromWei(value,'ether');
            console.log("Getting balance of: " + req.params.addr);
            res.json({"balance" : balance});
        });
    });
    api.route("/transaction").post((req, res) =>{
        const rawTx = {
            from: req.body.fromAddress,
            to: req.body.toAddress,
            value: req.body.amount,
        }
        const tx = new Tx(rawTx);
        tx.sign(new Buffer(req.body.fromPrivateKey, 'hex'));
        console.log(new Buffer(req.body.fromPrivateKey))
        var serializedTx = tx.serialize();
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', console.log);
        res.end();
    });
	return api;
}
