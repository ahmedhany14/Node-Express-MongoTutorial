const file_system = require('fs');



// 1) File System Module

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