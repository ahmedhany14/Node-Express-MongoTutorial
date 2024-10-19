const users = require('./../model/userModel')
const catchAsyncErrors = require('./../Utils/catchError.js')

exports.signUp = catchAsyncErrors(async (request, responce, next) => {

    const user = await users.create(request.body);

    responce.status(201).json({
        status: '201',
        message: user
    });
})

