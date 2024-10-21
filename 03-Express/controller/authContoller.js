const jwt = require('jsonwebtoken');
const users = require('./../model/userModel')
const catchAsyncErrors = require('./../Utils/catchError.js');

exports.signUp = catchAsyncErrors(async (request, responce, next) => {

    const user = await users.create(request.body);

    const token = jwt.sign({ id: user._id }, process.env.JWT_Secret, {
        expiresIn: process.env.JWT_expired
    })
    
    responce.status(201).json({
        status: '201',
        token: token,
        message: user
    });
})

