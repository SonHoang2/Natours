const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors')
var path = require('path');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const app = express();

// allow client access
// app.use(cors({ credentials: true, origin: process.env.BASEURL }));

app.use(cors({ credentials: true }));

// Set security HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));


// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '2MB' }));

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price',
        ]
    })
);

// test middleware
// app.use((req, res, next) => {
//   console.log(req.headers);
//   next();
// })


// allow client use images store in backend
app.use('/images/tours', express.static(path.join(__dirname + '/images/tours/')));
app.use('/images/users', express.static(path.join(__dirname + '/images/users/')));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;