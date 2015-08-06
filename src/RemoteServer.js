const mc = require('minecraft-protocol');
const RCONPool = require('./RCONPool');

class RemoteServer {

    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.rconpool = new RCONPool(host, this.getRCONPort());
    }

    getHost() {
        return this.host;
    }

    getPort() {
        return this.port;
    }

    getRCONPort() {
        return this.port + 1;
    }

    createClient(username) {
        return mc.createClient({
            username,
            host: this.host,
            port: this.port,
            'online-mode': false,
            keepAlive: false
        });
    }

    sendCommand(command) {
        this.rconpool.send(command); 
    }    

    setBlock(x, y, z, material, data) {
        this.rconpool.send(`setblock ${x} ${y} ${z} ${material} ${data}`);
    }

}

module.exports = RemoteServer;
