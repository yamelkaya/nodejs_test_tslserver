var config = require('./config');
var tls = require('tls');

var TlsServer = function (){
}

TlsServer.prototype = {
    init: function(){
        this.server = tls.createServer(config.server.options, function(cleartextStream) {
        });
        
        this.server.listen(config.server.port);
    }
}


module.exports = new TlsServer();