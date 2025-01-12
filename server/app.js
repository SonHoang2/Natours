import express from 'express';
import morgan from 'morgan';
import { crossOriginResourcePolicy } from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import { rateLimit } from 'express-rate-limit'
import AppError from './utils/AppError.js';
import globalErrorHandler from './controllers/errorController.js';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import config from './config/config.js';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const app = express();

// allow client access
app.use(cors({ credentials: true, origin: config.clientUrl }));

// Set security HTTP headers
app.use(crossOriginResourcePolicy({ policy: "cross-origin" }));


// Development logging
if (config.env === 'development') {
    app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '2MB' }));

// Serving static files
app.use(express.static(path.join(__dirname, '/public')));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Cookie parser (parse cookie from request)
app.use(cookieParser())

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

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100, 
	standardHeaders: 'draft-8',
	legacyHeaders: false,
})

app.use(limiter)

// allow client use images store in backend
app.use('/images/tours', express.static(path.join(__dirname + '/images/tours/')));
app.use('/images/users', express.static(path.join(__dirname + '/images/users/')));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;