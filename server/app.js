import express from 'express';
import morgan from 'morgan';
import { crossOriginResourcePolicy } from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import { join } from 'path';

import AppError from './utils/AppError.js';
import globalErrorHandler from './controllers/errorController.js';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

const app = express();

// allow client access
// app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

app.use(cors({ credentials: true }));

// Set security HTTP headers
app.use(crossOriginResourcePolicy({ policy: "cross-origin" }));


// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '2MB' }));

// Serving static files
// app.use(express.static((`${__dirname}/public`)));

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
// app.use('/images/tours', express.static(join(__dirname + '/images/tours/')));
// app.use('/images/users', express.static(join(__dirname + '/images/users/')));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;