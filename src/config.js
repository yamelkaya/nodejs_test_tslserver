var fs = require('fs');

var config = {}

config.server = {};

config.server.port = 8765;
config.server.options ={
    key: fs.readFileSync('private-key.pem'),
    cert: fs.readFileSync('public-cert.pem')
};

module.exports = config;