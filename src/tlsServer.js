var config = require('./config');
var tls = require('tls');

var TlsServer = function (){
}

TlsServer.prototype = {
    init: function(){
        var server = tls.createServer(config.server.options, function(stream) {
            if (stream.authorized){
                console.error("test");
            }
            else {
                console.error(stream.authorizationError);
            }
        });

        server.listen(config.server.port, function(){
            console.log('server bound');
        });

        return server;
    }
}


module.exports = new TlsServer();