const jwt = require('jsonwebtoken');
const users = require('./../model/userModel')
const catchAsyncErrors = require('./../Utils/catchError.js');
const AppError = require('./../Utils/appErros.js')
const bcryptjs = require('bcryptjs')

const token_sign = async function (id) {
    return await jwt.sign({ id }, process.env.JWT_Secret, {
        expiresIn: process.env.JWT_expired
    })
}

exports.signUp = catchAsyncErrors(async (request, responce, next) => {

    const user = await users.create(request.body);

    const token = await token_sign(user._id)

    responce.status(201).json({
        status: 'succes',
        token: token,
        message: user
    });
})


exports.login = catchAsyncErrors(async (request, responce, next) => {
    const { email, password } = request.body;

    if (!email || !password) {
        return next(new AppError('Please provide the password and email', 400))
    }

    const user = await users.findOne({ email: email }).select('+password')

    const is_correct_password = await user.compare_password(password, user.password)

    if (!user || !is_correct_password) {
        return next(new AppError('Please provide a correct password and email', 401))
    }

    const token = await token_sign(user._id)

    responce.status(201).json({
        status: 'succes',
        token: token,
        message: user
    })
})
