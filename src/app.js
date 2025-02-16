'use strict';

import express from 'express';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { errorHandler } from 'lib-finance-svc'
import { USERS_API, COOKIE_OPTIONS } from './constants.js';

// Routes
import routes from './routes/index.js';

const app = express();

// Setting up Middlewares
app.use(express.json({
    limit: '64kb' // Maximum request body size
}));

app.use(express.urlencoded({
    limit: '32kb',
    extended: false
}));

app.use(rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes max
    max: 200 // Limit each IP to 200 requestes per windowMs
}));

app.use(express.static('public'));

app.use(cookieParser(COOKIE_OPTIONS));

// Health Check Route
app.get(`${USERS_API}/health`, routes.healthCheck);

// Error Handler middleware
app.use(errorHandler);

export default app;
