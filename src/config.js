var fs = require('fs');

var config = {};

config.mainServerPort = 8765;
config.honypotServerPort = 8000;
config.clientKey = fs.readFileSync('client-private-key.pem');
config.clientCert = fs.readFileSync('client-certificate.pem');
config.serverKey = fs.readFileSync('server-private-key.pem');
config.serverCert = fs.readFileSync('server-certificate.pem');

module.exports = config;
