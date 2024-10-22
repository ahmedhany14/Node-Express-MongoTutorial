const AppError = require('./../Utils/appErros.js');

const CastErrorDB = err => {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new AppError(message, 400);
};

const CastduplicateDB = err => {
    const message = `the value ${err.errorResponse.keyValue.email} is already used, try another one`;
    return new AppError(message, 400);
};

const CastValiationError = err => {
    const erros = Object.values(err.errors).map(el => el.message)
    const messages = `Invalid Date, ${erros.join(', ')}`;
    return new AppError(messages, 400);
}

const JsonWebTokenError = err => new AppError('Invalid token please log in again.', 404)

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
    } else {
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

        console.log(err)
        let error = { ...err };

        if (err.name === 'CastError') error = CastErrorDB(error);
        else if (err.code == 11000) error = CastduplicateDB(error)
        //else if (err.statusCode == 500) error = CastValiationError(error);
        if (err.name == "JsonWebTokenError") error = JsonWebTokenError(err)
        productionError(error, res);
    }
}