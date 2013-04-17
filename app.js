
/**
 * Module dependencies.
 */

var express = require('express')
  , https = require('https')
  , fs = require('fs')
  , path = require('path')
  , server_proxy = require('./server_proxy.js');

var options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 9000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.post('/cmd', server_proxy.index);

https.createServer(options,app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
