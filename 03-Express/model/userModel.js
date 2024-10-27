const mongoose = require("mongoose");
const validator = require('validator');
const encode = require('bcryptjs')
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
    name: {
        type: String, required: [true, "please provied your name"], trim: true
    }, email: {
        type: String,
        required: [true, 'please provied your email'],
        unique: true,
        validate: [validator.isEmail, 'provied a valid email']
    }, role: {
        type: String, enum: ['admin', 'user', 'lead-guide'], default: 'user'
    }, photo: String, password: {
        type: String,
        required: [true, 'no password enterd'],
        minlength: [8, 'the password should be at least 8 characterd'],
        select: false
    }, passwordConfirm: {
        type: String,
        required: [true, 'no field enterd'],
        minlength: [8, 'the password should be at least 8 characterd'],
        validate: {
            // will works with save and create only, but not with update, so take care
            validator: function (pass) {
                return pass == this.password
            }, message: "Passwords are not the same"
        },
    },

    passwordChangedAt: Date, passwordResetToken: String, passwordTokenExpire: Date,
    active: {
        type: Boolean, default: true, select: false
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await encode.hash(this.password, 12)
    this.passwordConfirm = undefined
    next()
})

userSchema.pre(/^find/, async function (next) {
    this.find({active: {$ne: false}});
    next();
})
userSchema.pre('save', function (next) {
    // for assign the time of modifying the password
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now();

    next();
})

userSchema.methods.compare_password = async function (password, correct_password) {
    return await encode.compare(password, correct_password)
}

userSchema.methods.passwordChanged = function (JWT_Date) {
    if (this.passwordChangedAt) {
        const newchange_date = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return newchange_date > JWT_Date;
    }
    return false;
}

userSchema.methods.resetTokenPassword = function () {
    const token = crypto.randomBytes(32).toString('hex');

    // encrypt the token, because if any one has the access to the DB can't know it
    this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    this.passwordTokenExpire = Date.now() + 60 * 10 * 1000;

    return token;
}

const users = mongoose.model('users', userSchema)

module.exports = users