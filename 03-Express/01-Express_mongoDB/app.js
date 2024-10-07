const express = require('express');
const app = express();
const morgan = require('morgan');

const toursRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');

app.use(express.json()); // middleware


// custom middleware
/*
app.use((request, responce, next) => {
    console.log('Hello from the  first middleware function\n');
    // to continue to the next middleware, we use next()
    next();
})

app.use((request, responce, next) => {

    console.log('You are in the second middleware function');

    //  log host name, request method, request url
    console.log(`Host: ${request.hostname}`);
    console.log(`method: ${request.method}`);
    console.log(`url: ${request.path}`);

    // to continue to the next middleware, we use next()
    next();
});

app.use((request, responce, next) => {
    request.reqTime = new Date().toISOString();
    console.log(`request time: ${request.reqTime}`);
    next();
})
*/
// third party middleware
app.use(morgan('dev'));



app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

module.exports = app;