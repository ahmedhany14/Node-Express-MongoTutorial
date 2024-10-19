const mongoose = require("mongoose");
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please provied your name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'please provied your email'],
        unique: true,
        validate: [validator.isEmail, 'provied a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'no password enterd'],
        minlength: [8, 'the password should be at least 8 characterd']
    },
    passwordConfirm: {
        type: String,
        required: [true, 'no field enterd'],
        minlength: [8, 'the password should be at least 8 characterd'],
        validate: {
            // will works with save and create only, but not with update, so take care
            validator: function (pass) {
                return pass == this.password
            },
            message: "Passwords are not the same"
        }
    }
})

const users = mongoose.model('users', userSchema)

module.exports = users