const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// GLOBAL MIDDLEWARE

// Securing HTTP
app.use(helmet());

// Development environment
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
    max: 1000,
    windowMS: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour',
});
app.use('/api', limiter);

// Body parser
app.use(
    express.json({
        limit: '10kb',
    })
);

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against Parameter Pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsAverage',
            'ratingsQuantity',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    })
);

// Data sanitization against XSS
app.use(xss());

// Serving static content
app.use(express.static(`${__dirname}/public`));

// Test Middleware
app.use((req, res, next) => {
    req.requestedTime = new Date().toISOString();
    next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
    /* res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl}`,
    }); */

    /* const err = new Error(`Can't find ${req.originalUrl}`);
    err.status = 'fail';
    err.statusCode = 404; */
    next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

/* 
// ALTERNATIVE FOR ROUTES
app.get('/api/v1/tours', getAllTours);
app.post('/api/v1/tours', createTour);

app.get('/api/v1/tours/:id', getTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);
 */
