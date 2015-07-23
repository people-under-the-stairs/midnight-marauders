var Hapi    = require("hapi");
var server  = new Hapi.Server();
var Path    = require('path');
var index   = Path.resolve(__dirname + '/../public/index.html');
var Bell    = require('bell');
var Cookie  = require('hapi-auth-cookie');
var Joi     = require('joi');
var handler = require('./handler');
var config  = require('./config');
var routes  = require("./routes");

server.connection({
  port:  Number(process.env.PORT) || 8000
});

server.register([require('bell'), require('hapi-auth-cookie')], function(err) {

  if (err){
    throw err;
  }

  server.auth.strategy('facebook', 'bell', {
    provider  : 'facebook',
        password    : config.facebook.clientSecret,
        clientId    : config.facebook.clientId,
        clientSecret: config.facebook.clientSecret,
        isSecure    : false
  });

  server.auth.strategy('session', 'cookie', {
        password        : config.cookie.password,
        cookie          : 'sid',
        isSecure        : false
    });
});

server.route(routes);

module.exports = server;
