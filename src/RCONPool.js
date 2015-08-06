const { EventEmitter } = require('events');
const RCON = require('rcon');
const range = require('lodash.range');
 
const PASSWORD    = 'sandstone';
const CONNECTIONS = 1;

const noop = ()=>{}

class RCONPool {

    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.pool = range(CONNECTIONS).map(() => this.createConnection());
        this.rr = 0;
    }

    createConnection() {
        var con = new RCONConnection(this.host, this.port, PASSWORD);
        con.on('end', () => {
            this.pool.splice(this.pool.indexOf(con), 1);
            this.pool.push(this.createConnection());
        });
        return con;
    }

    send(command, cb) {
	this.pool[this.rr++].send(command);
        if(this.rr == this.pool.length) this.rr = 0;
    }
}

class RCONConnection extends EventEmitter {

    constructor(host, port, password) {
        super();
    
        this.waiting = [];
 
        var con = new RCON(host, port, password);
        con.on('auth', (res) => {
            this.emit('auth', res);
        });
        con.on('end', (res) => {
            this.emit('end', res);            
        });
        con.on('response', (res) => {
           this.waiting.shift()(res); 
        });
        con.connect();
        this.con = con;

        this.queue = [];
        setInterval(() => {
            if(this.queue.length == 0) // TODO: Pause loop when queue is empty
                return;    
            var [cmd, cb] = this.queue.shift();
            this.con.send(cmd);       
            this.waiting.push(cb);
        }, 50);
    }

    send(command, cb = noop) { 
        this.queue.push([command, cb]);
    }

}

module.exports = RCONPool;
