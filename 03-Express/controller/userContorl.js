const catchAsyncErrors = require("./../Utils/catchError")
const AppError = require('./../Utils/appErros')
const Users = require("./../model/userModel")
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const factory = require('./factoryHandler')

exports.updateMe = catchAsyncErrors(async (request, response, next) => {
    // this function will only allow the user to update his name and his email.
    const { name, email } = request.body;

    // 1) check if name and email is not empty
    if (!name || !email) return next(new AppError('Please fill name and email', 401))

    // 2) check email not used before
    // if there is any problem with validators this will return error
    const id = request.user._id;
    const user = await Users.findByIdAndUpdate(id, { name: name, email: email }, { new: true, runValidators: true })
    request.user = user;

    // 3) success message
    response.status(200).json({
        status: "success", user
    })
})

exports.deActivateUser = catchAsyncErrors(async (request, response, next) => {
    const id = request.user._id;
    request.user = await Users.findByIdAndUpdate(id, { active: false }, {
        new: true, runValidators: true
    })

    response.status(200).json({
        status: "success", data: null
    })
})

exports.GetAllUsers = factory.getAll(Users)
exports.GetUser = factory.getOne(Users)
exports.CreateUser = factory.create(Users);
exports.UpdateUser = factory.updateOne(Users)
exports.DeleteUser = factory.deleteOne(Users);
