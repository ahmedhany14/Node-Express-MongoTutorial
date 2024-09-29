const file_system = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./JsModules/replaceTemp.js');
// 1) File System 

// 1.1) Reading Files

/*
to read a file we use the fs.readFile() Asynchronously and fs.readFileSync() Synchronously.
fs.readFile() takes 3 arguments:
1. path of the file
2. encoding type
3. callback function that takes 2 arguments: error and data

fs.readFileSync() takes 2 arguments:
1. path of the file
2. encoding type
*/


// 1.1.1) file_system.readFile()
// this is not recommended because it blocks the code execution.
// don't return the data, instead pass it to a callback function
/*
const sync_callback = function (error, data) {
    try {
        if (error) throw error;
    } catch (error) {
        console.log('error');
        console.log(error);
        return;
    }
    console.log('Asynchronously read :', data);
};

file_system.readFile('./txt/input.txt', 'utf-8', sync_callback);

// 1.1.2) file_system.readFileSync()
// this is recommended because it doesn't block the code execution
// return the data

const async_file = file_system.readFileSync('./txt/input.txt', 'utf-8');
console.log('Synchronously read :', async_file);
*/
// 1.2) Writing Files
/*
to write a file we use the fs.writeFile() Asynchronously and fs.writeFileSync() Synchronously.

fs.writeFile() takes 3 arguments:
1. path of the file
2. data to write
3. callback function that takes 1 argument: error

fs.writeFileSync() takes 2 arguments:
1. path of the file
2. data to write
*/

/*
const text_to_write = `this is the file i read before 1 seconde\n${async_file}`;
const path_url = "./txt/output.txt";
// 1.2.1) file_system.writeFile()


file_system.writeFile(path_url, text_to_write, (error) => {
    try {
        if (error) throw error;
    } catch (error) {
        console.log('error');
        console.log(error);
        return;
    }
    console.log('Asynchronously: file written successfully');
});


// 1.2.2) file_system.writeFileSync()

file_system.writeFileSync(path_url, text_to_write);

console.log('Synchronously: file written successfully');

*/


// 2) Servers

// 2.1) Creating a server

/*
to create a server we use the http.createServer() method that takes a callback function that takes 2 arguments: request and response.
*/

/*
Routes: is the part of the URL that determines which page to show.
for example: in the URL http://localhost:3000/home, the route is /home
the server should respond to different routes with different responses.
to get the route we use the request.url property.
*/

/*
Write headers: the server should write headers before writing the response.
we use it to set the content type of the response, for example, text/html, text/plain, application/json, etc. and the status code of the response, for example, 200, 404, 500, etc.
*/

/*
const serverRequest = function (request, response) {
    // get the route
    const route = request.url;

    if (route === '/') {
        response.end('Welcome to the home page');
    }
    else if (route === "/nudes") {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end('we learn node.js here, no nudes');
    }
    else if (route === "/haterror") {
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end('<h1>404 page not found</h1>');
    }
    else {
        response.end('Hello from Hany');
    }
};

const server = http.createServer(serverRequest)
*/
// 2.2) Starting a server

/*
to start a server we use the server.listen() method that takes 2 arguments: port and host.
port is the port number that the server will listen to.
host is the host name or IP address of the server.
*/

/*
const data = file_system.readFileSync('/home/hany_jr/Back end/Node-Express-MongoTutorial/01-node-farm/dev-data/data.json', 'utf-8');
const api_data = JSON.parse(data);
console.log(typeof api_data);
const serverRequest = function (request, response) {
    route = request.url;
    if (route === "/") {
        response.end('Welcome to the home page');
    }
    else if (route == '/overview') {
        response.end('This is the overview page');
    }
    else if (route == '/api') {
        console.log('sss');
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(api_data);
    }

}

const server = http.createServer(serverRequest)



server.listen(1031, "127.0.0", () => {
    console.log('server is started, start by visiting http://127.0.0:1031');
});
*/

const data = file_system.readFileSync('/home/hany_jr/Back end/Node-Express-MongoTutorial/01-node-farm/dev-data/data.json', 'utf-8');
const api_data = JSON.parse(data);


const card_template = file_system.readFileSync('/home/hany_jr/Back end/Node-Express-MongoTutorial/01-node-farm/templates/template-card.html', 'utf-8');
const overview_template = file_system.readFileSync('/home/hany_jr/Back end/Node-Express-MongoTutorial/01-node-farm/templates/template-overview.html', 'utf-8');
const product_template = file_system.readFileSync('/home/hany_jr/Back end/Node-Express-MongoTutorial/01-node-farm/templates/template-product.html', 'utf-8');

const serverRequest = function (request, response) {
    const route = request.url;

    const { query, pathname } = url.parse(request.url, true);

    // 1) overview page
    /*
    will contain a list of all the products in the farm
    */
    if (pathname === '/overview') {
        // make page as a html
        let cards_html = api_data.map((product) => replaceTemplate(card_template, product)).join('');
        let output = overview_template.replace(/{%PRODUCT_CARDS%}/g, cards_html);

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(output);
    }
    // 2) product page
    /*
    will contain the details of a specific product 
    */
    else if (pathname === '/product') {
        const id = query.id;
        const product = api_data[id];
        const output = replaceTemplate(product_template, product);
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(output);
    }
    else {
        response.end('Fuck you son of bitch');
    }
}
const server = http.createServer(serverRequest);

server.listen(1053, "127.0.0", () => {
    console.log('server is started, start by visiting http://127.0.0:1053/overview');
});