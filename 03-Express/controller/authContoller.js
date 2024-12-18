const { promisify } = require('util')
const jwt = require('jsonwebtoken');
const users = require('./../model/userModel')
const catchAsyncErrors = require('./../Utils/catchError.js');
const AppError = require('./../Utils/appErros.js')
const Email = require('./../Utils/email.js')
const crypto = require('crypto')

const createNewToken = async (user, statusCode, response) => {
    const token = await token_sign(user._id)

    const cookiesOptions = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * process.env.COOKIE_EXPIRES_IN), httpOnly: true
    }
    if (process.env.NODE_ENV == 'production') cookiesOptions.secure = true
    response.cookie('jwt', token, cookiesOptions)

    user.password = undefined;
    response.status(201).json({
        status: 'success', token: token, message: user
    });
}

const token_sign = async function (id) {
    return await jwt.sign({ id }, process.env.JWT_Secret, {
        expiresIn: process.env.JWT_expired
    })
}

exports.signUp = catchAsyncErrors(async (request, response, next) => {

    const user = await users.create(request.body);

    const url = `${request.protocol}://${request.get('host')}/me`
    const message = "Welcome ya bdaaaaaaaaan"

    await new Email(user, url).sendWelcome('Welcome', message);

    await createNewToken(user, 201, response)
})


exports.login = catchAsyncErrors(async (request, response, next) => {
    const { email, password } = request.body;

    if (!email || !password) {
        return next(new AppError('Please provide the password and email', 400))
    }

    const user = await users.findOne({ email: email }).select('+password')

    const is_correct_password = await user.compare_password(password, user.password)

    if (!user || !is_correct_password) {
        return next(new AppError('Please provide a correct password and email', 401))
    }
    await createNewToken(user, 201, response)

})


exports.protect = catchAsyncErrors(async (req, res, next) => {


    // 1) Get the token from the header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        const error = new AppError('You need to log in', 401)
        next(error)
    }


    // Validate token

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_Secret)

    console.log(decoded)

    // Check id user is exist

    const user_id = decoded.id;

    const user = await users.findById({ _id: user_id })

    if (!user) {
        const error = new AppError('the user Not founded', 404)
        next(error)
    }
    // Check if the token expired or not
    const date = decoded.iat
    if (user.passwordChanged(date)) {
        const error = new AppError('The password has been changed', 404)
        next(error)
    }

    req.user = user;
    next()
})

exports.Permission = (...roles) => {
    return (req, res, next) => {
        return roles.includes(req.user.role) ? next() : next(new AppError('You do not have permission to perform this action', 401));
    }
}


exports.forgetpassword = async (req, res, next) => {
    const email = req.body.email;

    const user = await users.findOne({ email: email });
    if (!user) return next(new AppError('There is no user with this email you nee to sign up', 401))


    const resetToken = user.resetTokenPassword();

    // will get error, because of valiators
    //await user.save();

    // to avoid this error we will use validateBeforeSave: false to ignore the valdator
    await user.save({ validateBeforeSave: false });

    // send email to the user to reset the password
    try {

        const message = `Hello ${user.name}.
To change the password click ${req.protocol}//${req.get('host')}/api/v1/users/reset/${resetToken}
you have 10 minutes to reset your password.
The nature team`;

        await new Email(user, message).sendRestPasswordToken('Password reset token', message)
        res.status(200).json({
            status: 'success', message: 'Password recovered successfully please check your email'
        })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordTokenExpire = undefined;
        console.log(err)
        next(new AppError('There is a problem in sending the Password recovered email please try again later', 500))
    }

}

exports.resetPassword = catchAsyncErrors(async (req, response, next) => {
    // 1) get user form the token

    const token = req.params.token;
    const Hash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await users.findOne({
        passwordResetToken: Hash, passwordTokenExpire: {
            $gte: Date.now(),
        }
    });

    // 2) Check the expiration of the token
    if (!user) return next(new AppError('Token invalid or expired', 401))

    // 3) update data in the DB
    const { password, passwordConfirm } = req.body;
    user.passwordResetToken = undefined;
    user.passwordTokenExpire = undefined;
    user.password = password
    user.passwordConfirm = passwordConfirm
    await user.save();

    // 4) log the user in the app
    await createNewToken(user, 201, response)
})


exports.updatePassword = catchAsyncErrors(async (req, response, next) => {

    // 1) Check id user is existed
    const id = req.user._id;
    const user = await users.findById(id).select('+password');

    if (!user) return next(new AppError('You do not have permission to perform this action', 401));

    // 2) check if the posted password is correct.
    const { oldPassword, newPassword, confirm } = req.body;

    const is_correct_password = await user.compare_password(oldPassword, user.password)
    if (!is_correct_password) return next(new AppError("Password is incorrect", 401));

    // 3) update data in the database
    user.password = newPassword;
    user.passwordConfirm = confirm
    await user.save();

    // 4) log in with new token
    await createNewToken(user, 201, response)

})