const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        require: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        require: [true, 'Please provide a password'],
        minLength: 8,
        select: false //hide password
    },
    passwordConfirm: {
        type: String,
        require: [true, 'Please confirm your password'],
    },
    passwordChangedAt: Date
})

userSchema.pre('save', async function(next) {
    // only run this function if password was modified
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        // change date to number
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log(JWTTimestamp, changedTimestamp);
        return JWTTimestamp < changedTimestamp
    }
    // false means not changed
    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;