'use strict';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from 'lib-finance-service';

import { USERS_API } from './constants.js';

// User Routes

const app = express();

// Setting up Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN, // reflecting the request origin
    credentials: true
}));

app.use(express.json({
    limit: '64kb' // Maximum request body size.
}));

app.use(express.urlencoded({
    limit: '32kb',
    extended: false
}));

app.use(express.static('public'));

app.use(cookieParser());

// Routes

// Error Handler middleware
app.use(errorHandler);

export default app;
