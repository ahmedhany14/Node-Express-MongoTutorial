const users = require('./../model/userModel')
const catchAsyncErrors = require('./../Utils/catchError.js')

exports.signUp = catchAsyncErrors(async (request, responce, next) => {
    const user = { ...request.body };

    await users.create(user);

    responce.status(201).json({
        status: '201',
        message: user
    });
})

