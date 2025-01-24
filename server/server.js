import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';
import { connectRedis } from './redisClient.js';
import config from './config/config.js';


dotenv.config();

mongoose
.connect(config.db)
.then(() => console.log('DB connection successfull'));

await connectRedis();

const port = config.port || 5000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on('uncaughtException', err => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err);
    process.exit(1);
});

process.on('unhandledRejection', err => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});