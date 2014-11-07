var tls = require('tls');
var config = require('./config');

//region MAin server
var options = {
    key: config.serverKey,
    cert: config.serverCert,

    // This is necessary only if using the client certificate authentication.
    // Without this some clients don't bother sending certificates at all, some do
    requestCert: true,

    // Do we reject anyone who certs who haven't been signed by our recognised certificate authorities
    //rejectUnauthorized: true,

    // This is necessary only if the client uses the self-signed certificate and you care about implicit authorization
    ca: [ config.clientCert ]

};

var server = tls.createServer(options, function(cleartextStream) {

    //Show the certificate info as supplied by the client
    //console.log(cleartextStream.getPeerCertificate());

    //todo check payload header
    var remoteServerIP = cleartextStream.socket.remoteAddress;

    cleartextStream.on('data', function(data) {
        redirectDataToHoneypotServer(JSON.stringify({
            data: data,
            originalIP: remoteServerIP
        }));
    });

    cleartextStream.on('end', function() {
        //cleartextStream.close();
    });

    //console.log('server connected',
    //    cleartextStream.authorized ? 'authorized' : 'unauthorized');
    //cleartextStream.write("welcome!\n");
    //cleartextStream.setEncoding('utf8');
    //cleartextStream.pipe(cleartextStream);


    function redirectDataToHoneypotServer(data){
        var cleartextStream = tls.connect(config.honypotServerPort, clientOptions, function() {

            console.log('client connected to honeypot: ',
                cleartextStream.authorized ? 'authorized' : 'unauthorized');
            process.stdin.pipe(cleartextStream);
            //process.stdin.resume();
        });

        cleartextStream.write(data);
        cleartextStream.setEncoding('utf8');
        cleartextStream.pipe(cleartextStream);
    }
});
server.listen(config.mainServerPort, function() {
    console.log('server bound');
});

//endregion


//region Honeypot server
var honeypotServer = tls.createServer(options, function(cleartextStream){
    var remoteServerIP = cleartextStream.socket.remoteAddress;

    cleartextStream.on('data', function(data) {
        logInfoToDatabase(remoteServerIP,data);
        respondToInput();
    });

    cleartextStream.on('end', function() {
        //cleartextStream.close();
    });

    function logInfoToDatabase(serverIP, data){
        //todo: implement saving to the database
        console.log("Logged to the database: " + data);
    };

    function respondToInput(){
        //todo: random text
        cleartextStream.write("Hello!\n");
        cleartextStream.setEncoding('utf8');
        cleartextStream.pipe(cleartextStream);
    }
});
honeypotServer.listen(config.honypotServerPort, function() {
    console.log('honeypot server bound');
});
//endregion


//region client
var clientOptions = {
    // These are necessary only if using the client certificate authentication (so yeah, you need them)
    key: config.clientKey,
    cert: config.clientCert,

    // This is necessary only if the server uses the self-signed certificate
    ca: [ config.serverCert ]
};

var cleartextStream = tls.connect(config.mainServerPort, clientOptions, function() {
    //console.log(cleartextStream.getPeerCertificate());

    console.log('client connected',
        cleartextStream.authorized ? 'authorized' : 'unauthorized');
    process.stdin.pipe(cleartextStream);
    //process.stdin.resume();
});

cleartextStream.write("!!!!!!!!!!!!!");
cleartextStream.setEncoding('utf8');
cleartextStream.pipe(cleartextStream);


cleartextStream.setEncoding('utf8');
cleartextStream.on('data', function(data) {
    console.log("Response from 8765 server:" + data);
});
cleartextStream.on('end', function() {
    //cleartextStream.close();
});
//endregion
