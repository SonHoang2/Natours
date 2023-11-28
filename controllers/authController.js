const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/AppError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
})}

exports.signup = catchAsync( 
    async (req, res, next) => {
        // fix security risk in admin
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            // passwordChangedAt: req.body.passwordChangedAt
        });

        const token = signToken(newUser._id)

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        })
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // check if email and password exist
    if (!email || !password) {
        next(new AppError('Please provide email and password!', 400));
    }
    // check if user exists && password is correct
    const user = await User.findOne({email}).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
})

exports.protect = catchAsync(async(req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access', 401)
        );
    }
    // verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exits.', 
                401
        ));
    }
    // check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }
    
    req.user = currentUser;
    next();
})
