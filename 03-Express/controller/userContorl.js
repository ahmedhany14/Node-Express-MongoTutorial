const catchAsyncErrors = require("./../Utils/catchError")
const Users = require("./../model/userModel")

// user api functions
exports.GetAllUsers = catchAsyncErrors(async (request, responce, next) => {
    const users = await Users.find()

    responce.status(200).json({
        status: 'ok',
        data: {
            users: users
        }
    });
})

exports.GetUser = (request, responce) => {
    responce.status(404).json({
        status: 'error',
        message: 'Not implemented yet'
    });
}

exports.CreateUser = (request, responce) => {
    responce.status(404).json({
        status: 'error',
        message: 'Not implemented yet'
    });
}

exports.UpdateUser = (request, responce) => {
    responce.status(404).json({
        status: 'error',
        message: 'Not implemented yet'
    });
}

exports.DeleteUser = (request, responce) => {
    responce.status(404).json({
        status: 'error',
        message: 'Not implemented yet'
    });
}
