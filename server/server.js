import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';
import { connectRedis } from './redisClient.js';
import config from './config/config.js';

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err);
    process.exit(1);
});

dotenv.config();

mongoose
    .connect(config.db)
    .then(() => console.log('DB connection successfull'));

await connectRedis();

const port = config.port || 5000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
