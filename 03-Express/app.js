const express = require('express');
const app = express();
const morgan = require('morgan');
const AppErrors = require('./Utils/appErros')
const toursRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');
const ErrorHadeler = require('./controller/errorController')
app.use(express.json()); // middleware


// third party middleware
app.use(morgan('dev'));



app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

// Handel unhandeled routes
app.all('*', (req, res, next) => {
    const error = new AppErrors(`Can't find ${req.originalUrl} on the server`, 404)
    next(error);
});


app.use(ErrorHadeler)

module.exports = app;