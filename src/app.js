'use strict';

import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import { paramValidator, App } from 'lib-finance-svc'

import { USERS_API, COOKIE_OPTIONS } from './constants.js';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const openapiSpec = path.join(__dirname, 'openapi.yaml');

const appInstance = new App(openapiSpec);
const app = appInstance.app;

app.use(cookieParser(COOKIE_OPTIONS));

// // Health Check Route
app.get(`${USERS_API}/health`, routes.healthCheck);

// // System Setup Route
app.get(`${USERS_API}/service-info`, routes.serviceRoutes.getServiceConfig);
app.get(`${USERS_API}/service-info/:serviceId`, paramValidator, routes.serviceRoutes.getServiceConfig);
app.post(`${USERS_API}/register-service`, routes.serviceRoutes.registerServiceConfig);
app.put(`${USERS_API}/service-info/:serviceId`, paramValidator, routes.serviceRoutes.updateServiceConfig);

appInstance.registerErrorHandler();

export default app;
