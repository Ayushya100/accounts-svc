'use strict';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler, setUserContext } from 'lib-finance-service';

import { USERS_API } from './constants.js';

// User Routes
import routes from './routes/index.js';

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

setUserContext(app);

// System Setting Routes
app.post(`${USERS_API}/register-setting`, routes.settingRoutes.registerSetting);
app.get(`${USERS_API}/setting-info`, routes.settingRoutes.getSettingInfo);
app.get(`${USERS_API}/setting-info/:label`, routes.settingRoutes.getSettingInfo);
app.post(`${USERS_API}/register-route`, routes.settingRoutes.registerRoute);

app.post(`${USERS_API}/register-user-role`, routes.settingRoutes.registerUserRoleRoute);
app.get(`${USERS_API}/user-role`, routes.settingRoutes.getUserRoleInfo);
app.get(`${USERS_API}/user-role/:roleId`, routes.settingRoutes.getUserRoleInfo);
app.put(`${USERS_API}/user-role/:roleId`, routes.settingRoutes.updateUserRole);
app.delete(`${USERS_API}/user-role/:roleId`, routes.settingRoutes.deleteUserRole);

app.post(`${USERS_API}/user-scope`, routes.settingRoutes.createScope);
app.get(`${USERS_API}/user-role/:roleId/user-scope`, routes.settingRoutes.getUserScopeInfo);
app.get(`${USERS_API}/user-role/:roleId/user-scope/:scopeId`, routes.settingRoutes.getUserScopeInfo);
app.put(`${USERS_API}/user-role/:roleId/user-scope/:scopeId`, routes.settingRoutes.updateUserScope);
app.delete(`${USERS_API}/user-role/:roleId/user-scope/:scopeId`, routes.settingRoutes.deleteUserScope);

// User Setting Routes
app.get(`${USERS_API}/:userId/user-setup`, routes.userSetting.getUserDashboardSetup);

// Error Handler middleware
app.use(errorHandler);

export default app;
