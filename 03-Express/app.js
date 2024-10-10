const express = require('express');
const app = express();
const morgan = require('morgan');

const toursRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');

app.use(express.json()); // middleware


// third party middleware
app.use(morgan('dev'));



app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

module.exports = app;