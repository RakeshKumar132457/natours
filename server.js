const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT REJECTION');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then((con) => {
        console.log('DB connection successfully');
    });

// SERVER START
const port = process.env.PORT || 8000;
const url = '127.0.0.1';
const server = app.listen(port, () => {
    console.log(`Port listening on ${port}...`);
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
