var mc = require('minecraft-protocol');
var states = mc.states;

var RemoteServer = require('./RemoteServer');

var remote = new RemoteServer('localhost', 3000);

var server = mc.createServer({
    'online-mode': true,
    encryption: true,
    host: '0.0.0.0',
    keepAlive: false,
    port: 25565
});

function isPlay(target, self) {
	return (target === states.PLAY && self === states.PLAY);
}

server.on('login', function(client) {
    var tclient = remote.createClient(client.username);

    client.on('raw', function(buffer, state) {
        if (isPlay(tclient.state, state))
            tclient.writeRaw(buffer);
    });

    tclient.on('raw', function(buffer, state) {
        if (isPlay(client.state, state))
            client.writeRaw(buffer);
    });

    client.on('end', function() {
        tclient.end("End");
    });

    tclient.on('end', function() {
        client.end("End");
    });

    client.on('error', function() {
        tclient.end("Sandstone Error");
    });

    tclient.on('error', function() {
        client.end("Sandstone Error");
    });
});
