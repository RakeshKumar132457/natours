const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestedTime = new Date().toISOString();
    next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
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
