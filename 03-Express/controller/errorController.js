const AppError = require('./../Utils/appErros.js');

const CastErrorDB = err => {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new AppError(message, 400);
};


const developmentError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    })
}

const productionError = (err, res) => {

    if (err.operationalErorr) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
    else {
        res.status(500).json({
            states: 'error',
            message: 'Something went wrong'
        })
    }
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    })
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || '500';
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') developmentError(err, res);
    else {

        let error = { ...err };

        if (err.name === 'CastError') error = CastErrorDB(error);
        productionError(error, res);

    }
}