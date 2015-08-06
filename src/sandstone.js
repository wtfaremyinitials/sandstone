var mc = require('minecraft-protocol');

var RemoteServer = require('./RemoteServer');

var remote = new RemoteServer('localhost', 3000);

var server = mc.createServer({
    'online-mode': true,
    encryption: true,
    host: '0.0.0.0',
    port: 25565
});

server.on('login', function(client) {
    var tclient = remote.createClient(client.username);
    tclient.on('raw', (buffer, state) => {
        if(state == 'login') return;
        client.writeRaw(buffer); 
    });
    client.on('raw', (buffer, state) => {
        if(state == 'login') return;
        tclient.writeRaw(state);
    });
    tclient.on('end', function() {
        client.end('Sandstone error');
    });
    client.on('end', function() {
        tclient.end('Sandstone error');
    });
    tclient.on('end', function() {
        client.end('Sandstone error');
    }); 
    client.on('end', function() {
        tclient.end('Sandstone error');
    });
});
