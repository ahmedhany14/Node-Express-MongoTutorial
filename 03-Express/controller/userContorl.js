const catchAsyncErrors = require("./../Utils/catchError")
const AppError = require('./../Utils/appErros')
const Users = require("./../model/userModel")
const {promisify} = require("util");
const jwt = require("jsonwebtoken");
const multer = require('multer')
const factory = require('./factoryHandler')
const sharp = require('sharp')

// the multer disk storage is used to store the file in the disk, which defines the destination and the filename of the file.
/*const multerStorage = multer.diskStorage({
    destination: (request, file, callback) => { // destination is the path where the file will be stored
        callback(null, 'public/img/users')
    }, filename: (request, file, callback) => { // filename is the name of the file
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${request.user.id}-${Date.now()}.${ext}`
        callback(null, fileName)
    }
})*/

// the multer memory storage is used to store the file in the memory, which defines the destination and the filename of the file.
const multerStorage = multer.memoryStorage();

const filterMulter = (request, file, callback) => {
    file.mimetype.startsWith('image') ? callback(null, true) : callback(new AppError('Not an image! Please upload only images', 400), false)
}

exports. resizeImage = (request, response, next) => {
    // define image name
    const fileName = `user-${request.user.id}-${Date.now()}.jpeg`;

    request.file.filename = fileName;
    // buffer is the image in the memory
    sharp(request.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({quality: 20})
        .toFile(`public/img/users/${fileName}`)
    next();
}
const upload = multer({
    storage: multerStorage, fileFilter: filterMulter
})

// for uploading a single file
exports.uploadUserPhoto = upload.single('photo')

exports.updateMe = catchAsyncErrors(async (request, response, next) => {
    console.log(request.file)
    // 1) check if name and email is not empty
    if (request.body.password || request.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400))
    }

    // 2) check email not used before
    // if there is any problem with validators this will return error

    const filterBody = (obj, ...allowedFields) => {
        const newObj = {};
        Object.keys(obj).forEach(el => {
            if (allowedFields.includes(el)) newObj[el] = obj[el]
        });
        return newObj;
    }

    const filterObj = filterBody(request.body, 'name', 'email');
    if (request.file) filterObj.photo = request.file.filename;
    const id = request.user._id;
    const user = await Users.findByIdAndUpdate(id, filterObj, {
        new: true, runValidators: true
    })
    request.user = user;

    // 3) success message
    response.status(200).json({
        status: "success", user
    })
})

exports.deActivateUser = catchAsyncErrors(async (request, response, next) => {
    const id = request.user._id;
    request.user = await Users.findByIdAndUpdate(id, {active: false}, {
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
