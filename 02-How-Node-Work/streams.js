const server = require('http').createServer();
const file_system = require('fs');



server.on('request', (requuest, responce) => {
    console.log('Request event')

    // 1) Soluution 1 to read data, Blocking code
    /*
    we just read the file and we don't care about the data
    */


    /*
    file_system.readFile('./test-file.txt', (err, data) => {
        if (err) console.log(err);
        responce.end(data)
    })
    */
    // this solution is not good for large files, and it will block the event loop


    // 2) Solution 2 to read data, Streams
    /*
    just read the data but chunk by chunk, and write it to the responce, then end the responce
    */

    /*
    const stream = file_system.createReadStream('./test-file.txt');
    stream.on('data', (chunk) => {
        responce.write(chunk);
    })
    stream.on('end', () => {
        responce.end();
    })

    stream.on('error', (err) => {
        console.log(err);
        responce.end('File not found');
    })

    */

    // 3) Solution 3 to read data, pipe


    const stream = file_system.createReadStream('./test-file.txt');
    stream.pipe(responce);
});

server.listen(8000, "127.0.0.1", () => {
    console.log('Server is running on port 8000');
    console.log('127.0.0.1:8000');
})