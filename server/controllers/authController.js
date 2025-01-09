import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import sendEmail from '../utils/email.js';
import crypto from 'crypto';

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = async (user, statusCode, res) => {
    const accessToken = signToken(user.id, config.jwt.ATExpiresIn);
    const refreshToken = signToken(user.id, config.jwt.RTExpiresIn);

    const ATOptions = {
        expires: new Date(
            Date.now() + config.jwt.ATCookieExpiresIn * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false
    };

    const RTOptions = {
        expires: new Date(
            Date.now() + config.jwt.RTCookieExpiresIn * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        path: '/api/v1/auth/'
    };

    res.cookie('access_token', accessToken, ATOptions);
    res.cookie('refresh_token', refreshToken, RTOptions);

    const value = String(user.id);

    // await client.set(refreshToken, value, 'EX', 7 * 24 * 60 * 60); // auto delete after 1 days

    // remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        data: {
            user
        }
    });
};

export const signup = catchAsync(
    async (req, res, next) => {
        const { name, email, password, passwordConfirm } = req.body;

        if (!name || !email || !password || !passwordConfirm) {
            return next(new AppError('Please provide all required fields!', 400));
        }

        if (password !== passwordConfirm) {
            return next(new AppError('Passwords do not match!', 400));
        }

        const filter = {
            name: name,
            email: email,
            password: password
        };

        const newUser = await User.create(filter);

        createSendToken(newUser, 201, res);
    });

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // check if email and password exist
    if (!email || !password) {
        next(new AppError('Please provide email and password!', 400));
    }
    // check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    if (!user.active) {
        next(new AppError('Your account has been deactivated and can no longer be used.', 401));
    }

    createSendToken(user, 200, res);
});

export const GoogleLogin = catchAsync(async (req, res, next) => {
    let { code, redirectUri } = req.body; // code from service provider which is appended to the frontend's URL

    const clientId = process.env.GOOGLE_CLIENT_ID; // CLIENT_ID_FROM_APP_CREATED
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET; // CLIENT_SECRET_FROM_APP_CREATED
    const grantType = 'authorization_code'; // this tells the service provider to return a code which will be used to get a token for making requests to the service provider
    const url = 'https://oauth2.googleapis.com/token'; // link to api to exchange code for token.

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            clientId,
            clientSecret,
            redirectUri,
            code,
            grantType,
        }),
    });
    const data = await response.json();

    const { email, given_name, family_name } = jwt.decode(data.id_token);

    // use if i want to get more info about the user
    // const tokenFromGoogle = data.access_token;
    // const urlForGettingUserInfo = 'https://www.googleapis.com/oauth2/v2/userinfo';

    // const response1 = await fetch(urlForGettingUserInfo, {
    //     method: 'GET',
    //     headers: {
    //         Authorization: `Bearer ${tokenFromGoogle}`,
    //     },
    // });

    // const userData = await response1.json();


    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({ name: given_name + " " + family_name, email });
    }


    createSendToken(user, 201, res);
});

export const protect = catchAsync(async (req, res, next) => {
    let token;
    // if (req.headers.cookie) {
    //     token = req.headers.cookie.slice(4);
    // }
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
});

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin, 'lead-guide]  .role = 'user'
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError("You do not have permission to perform this action", 403)
            );
        }
        next();
    };
};

export const forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError('There is no user with email address.', 404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.CLIENT_URL}/user/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        console.log(err);

        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(
            new AppError('There was an error sending the email. Try again later!', 500)
        );
    }
});

export const resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user, 200, res);
});