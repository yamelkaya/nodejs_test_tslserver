var fs = require('fs');

var config = {}

config.server = {};

config.server.port = 8765;
config.server.securityOptions ={
    key: fs.readFileSync('private-key.pem'),
    cert: fs.readFileSync('public-cert.pem')
};
config.server.clientCert = fs.readFileSync('public-cert2.pem')

module.exports = config;