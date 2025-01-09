import { Schema, model } from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import { hash, compare } from 'bcrypt';
import { randomBytes, createHash } from 'crypto';

const userSchema = new Schema({
    name: {
        type: String,
        minLength: [5, 'A user name must have more or equal to 6 characters'],
        require: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        require: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String,
        default: "default.jpg"
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        require: [true, 'Please provide a password'],
        minLength: 12,
        select: false //hide password
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
    }
})

userSchema.pre('save', async function (next) {
    // only run this function if password was modified
    if (!this.isModified('password')) return next();

    this.password = await hash(this.password, 12);
    next();
})

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        // change date to number
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp
    }
    // false means not changed
    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = randomBytes(32).toString('hex');

    this.passwordResetToken = createHash('sha256')
        .update(resetToken) // data to be hash
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

const User = model('User', userSchema);

export default User;