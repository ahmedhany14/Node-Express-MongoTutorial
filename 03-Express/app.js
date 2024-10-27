const express = require('express');
const app = express();
const morgan = require('morgan');
const AppErrors = require('./Utils/appErros')
const toursRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');
const ErrorHadeler = require('./controller/errorController')
const limitRate = require('express-rate-limit')
const helmet = require('helmet')
const mongo_sanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')

app.use(helmet())

// middleware
app.use(express.json({limit: '10kb'}));

// third party middleware
if (process.env.NODE_ENV == 'development') app.use(morgan('dev'));

// middleware to limit number of requests
const limiter = limitRate({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "to many requests"
})
// will make ant ip requests the url in the rout /api, have only 100 request per hour
app.use(mongo_sanitize());
app.use(xss());

app.use('/api', limiter)

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

// Handel unhandeled routes
app.all('*', (req, res, next) => {
    const error = new AppErrors(`Can't find ${req.originalUrl} on the server`, 404)
    next(error);
});


app.use(ErrorHadeler)

module.exports = app;