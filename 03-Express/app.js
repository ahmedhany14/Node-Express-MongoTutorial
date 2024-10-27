const express = require('express');
const app = express();
const morgan = require('morgan');
const AppErrors = require('./Utils/appErros')
const toursRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');
const ErrorHadeler = require('./controller/errorController')
const limitRate = require('express-rate-limit')

app.use(express.json()); // middleware


// third party middleware
app.use(morgan('dev'));

const limiter = limitRate({
    max: 2,
    windowMs: 60 * 60 * 1000,
    message: "to many requests"
})

// will make ant ip requests the url in the rout /api, have only 100 request per hour
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