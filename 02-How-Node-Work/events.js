const evenEmitter = require('events');
const http = require('http');


const myEmitter = new evenEmitter();

myEmitter.on('press', () => {
    console.log('1) Event pressed')
})


myEmitter.on('press', () => {
    console.log('2) you presse me')
})


myEmitter.on('press', (times) => {
    console.log(`3) you pressed me ${times} times`)
})


// myEmitter.emit('press');
myEmitter.emit('press', 3);
// ---------------------------------------

// server events



const server = http.createServer();



server.on('request', (req, res) => {
    console.log('request event')
    res.end('Request event')
})

server.on('close', () => {
    console.log('close event')
})


server.listen(8000, '127.0.0.3', () => {
    console.log('wating for requests')
    console.log('server is running on port 8000')
    console.log('127.0.0.3:8000')
})