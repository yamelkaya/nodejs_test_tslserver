var tlsServer = require('./tlsServer');
var tls = require('tls');
var config = require('./config');

tlsServer.init();

var conn = tls.connect(config.server.port, config.server.options, function() {
    console.log('connected');
});

conn.on("data", function (data) {
    console.log(data.toString());
    conn.end();
});
