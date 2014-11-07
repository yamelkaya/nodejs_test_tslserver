var tls = require('tls');
var config = require('./config');

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

function initTlsServer(){
    var server = tls.createServer({
        key :config.server.securityOptions.key,
        cert: config.server.securityOptions.cert,
        ca: [config.server.securityOptions.cert]
    }, function(stream) {

        //stream.on('data', function(data) {
        //    console.log(data);
        //});
        //stream.on('end', function() {
        //    server.close();
        //});

        //stream.pipe(stream);
        //console.dir(stream);
        process.stdin.pipe(stream);
        process.stdin.resume();

        stream.write("test!!!!!!!!!!!!!\n");


        //
        //if (stream.authorized){
        //    console.error("test");
        //}
        //else {
        //    console.error(stream.authorizationError);
        //}
    });

    server.listen(config.server.port);
}

function testConnection(){

    var conn = tls.connect(config.server.port,
        {
            //key :config.server.securityOptions.key,
            cert: config.server.securityOptions.cert
        },
        function(stream) {
        if (conn.authorized) {
            console.log("Connection authorized by a Certificate Authority.");
        } else {
            console.log("Connection not authorized: " + conn.authorizationError)
        }
        console.log();
    });



    conn.on("data", function (data) {
        console.log(data.toString());
        conn.end();
    });
}

initTlsServer();

//testConnection();


