var bitcoin = require('bitcoin');
var config = require('./config.js');

var client = new bitcoin.Client(config.server);

exports.index = function(req, res){
  var rpc = req.body.rpc?req.body.rpc:'';
  if(rpc) rpc = JSON.parse(rpc);
  var method = rpc.method?rpc.method:'';
  var params = rpc.params?rpc.params:[];
  var cb =  function(err,data){
    if(err) res.json(err);
      res.json(data);
  };
  var args = params;
  args.unshift(method);
  args.push(cb);
  console.log(args);
    client.cmd.apply(client,args);
};