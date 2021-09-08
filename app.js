var fs = require('fs');


// app_config is configuration file
var app_config = fs.readFileSync("./config.json");
app_config = JSON.parse(app_config)
app_config = app_config[app_config['use-settings']]

/*
// using https server for ssl
var https = require('https');
// ssl credentials
var privateKey  = fs.readFileSync('./keys/cert.key', 'utf8');
var certificate = fs.readFileSync('./keys/cert.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
*/

var express = require('express')
var app = express() // express object
app.set('port', app_config['http-port'])

// used for user sessiona nd cookies
var session = require('express-session');
var cookieParser = require('cookie-parser');

server_domain = app_config['server-domain']

// httpS server object to handle https requests
// var httpsServer = https.createServer(credentials, app);


var web3Handler = require('./modules/web3Handler.js')

// global.web3Handler.connect(()=>{
//   db = global.mongoHandler.getDB()
// })

//Including the routes module
// var routes = require("./modules/routes");
require('./modules/routes/root')(app);


app.listen(app.get('port'), function(){
  console.log('Server up: http://localhost:' + app.get('port'));
});
/*
httpsServer.listen(app_config['https-port'], ()=>{
  console.log('Server up: https://localhost:10001')
});
*/
