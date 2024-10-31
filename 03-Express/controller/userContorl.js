const catchAsyncErrors = require("./../Utils/catchError")
const AppError = require('./../Utils/appErros')
const Users = require("./../model/userModel")
const { request, response } = require("express");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const factory = require('./factoryHandler')
// user api functions
exports.GetAllUsers = catchAsyncErrors(async (request, responce, next) => {
    const users = await Users.find()

    responce.status(200).json({
        status: 'ok', data: {
            users: users
        }
    });
})

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

    // 3) success message
    response.status(200).json({
        status: "success", data: null
    })
})

exports.GetUser = (request, responce) => {
    responce.status(404).json({
        status: 'error', message: 'Not implemented yet'
    });
}

exports.CreateUser = factory.create(Users);
exports.UpdateUser = factory.updateOne(Users)
exports.DeleteUser = factory.deleteOne(Users);
