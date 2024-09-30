const file_system = require('fs')


setTimeout(() => {
    console.log('timer 1 finished')
}, 0);

setImmediate(() => {
    console.log('immediate 1 finished')
});

file_system.readFile('./test-file.txt', 'utf8', () => {
    console.log('txt file data:')

    console.log('---------------------------------------')

    setTimeout(() => {
        console.log('timer 2 finished')
    }, 0);

    setImmediate(() => {
        console.log('immediate 2 finished')
    });

    setTimeout(() => {
        console.log('timer 3 finished')
    }, 5000);

    setImmediate(() => {
        console.log('immediate 3 finished')
    });


    process.nextTick(() => {
        console.log('process.nextTick')
    })

})


console.log("Helloooo from Ahmeds code")