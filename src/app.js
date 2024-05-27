'use strict';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { errorHandler, setUserContext, verifyToken, verifyScope } from 'lib-finance-service';

import { USERS_API } from './constants.js';

// User Routes
import routes from './routes/index.js';

const tokenKey = process.env.ACCESS_TOKEN_KEY;
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

app.use(rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes max
    max: 200 // Limit each IP to 200 requests per windowMs
}));

app.use(express.static('public'));

app.use(cookieParser());

setUserContext(app);

// System Setup Routes
app.get(`${USERS_API}/system-setup`, routes.userSetting.getSystemSetup);

// User Account Routes
app.post(`${USERS_API}/register-user`, routes.userRoutes.registerUser);
app.put(`${USERS_API}/:userId/verify-user`, routes.userRoutes.verifyUser);
app.post(`${USERS_API}/login-user`, routes.userRoutes.loginUser);

app.use(verifyToken(tokenKey));

// System Setting Routes
app.post(`${USERS_API}/register-setting`, routes.settingRoutes.registerSetting);
app.get(`${USERS_API}/setting-info`, routes.settingRoutes.getSettingInfo);
app.get(`${USERS_API}/setting-info/:label`, routes.settingRoutes.getSettingInfo);

app.post(`${USERS_API}/register-route`, verifyScope('ROUTE.U'), routes.settingRoutes.registerRoute);
app.get(`${USERS_API}/app-route`, verifyScope('ROUTE.V'), routes.settingRoutes.getAppRouteInfo);
app.get(`${USERS_API}/app-route/:routeId`, verifyScope('ROUTE.V'), routes.settingRoutes.getAppRouteInfo);
app.put(`${USERS_API}/app-route/:routeId`, verifyScope('ROUTE.U'), routes.settingRoutes.updateAppRoute);
app.delete(`${USERS_API}/app-route/:routeId`, verifyScope('ROUTE.D'), routes.settingRoutes.deleteAppRoute);

app.post(`${USERS_API}/register-user-role`, verifyScope('ROLE.U'), routes.settingRoutes.registerUserRoleRoute);
app.get(`${USERS_API}/user-role`, verifyScope('ROLE.V'), routes.settingRoutes.getUserRoleInfo);
app.get(`${USERS_API}/user-role/:roleId`, verifyScope('ROLE.V'), routes.settingRoutes.getUserRoleInfo);
app.put(`${USERS_API}/user-role/:roleId`, verifyScope('ROLE.U'), routes.settingRoutes.updateUserRole);
app.delete(`${USERS_API}/user-role/:roleId`, verifyScope('ROLE.D'), routes.settingRoutes.deleteUserRole);

app.post(`${USERS_API}/user-scope`, verifyScope('SCOPE.U'), routes.settingRoutes.createScope);
app.get(`${USERS_API}/user-role/:roleId/user-scope`, verifyScope('SCOPE.V'), routes.settingRoutes.getUserScopeInfo);
app.get(`${USERS_API}/user-role/:roleId/user-scope/:scopeId`, verifyScope('SCOPE.V'), routes.settingRoutes.getUserScopeInfo);
app.put(`${USERS_API}/user-role/:roleId/user-scope/:scopeId`, verifyScope('SCOPE.U'), routes.settingRoutes.updateUserScope);
app.delete(`${USERS_API}/user-role/:roleId/user-scope/:scopeId`, verifyScope('SCOPE.D'), routes.settingRoutes.deleteUserScope);

// User Setting Routes
app.get(`${USERS_API}/:userId/user-setup`, routes.userSetting.getUserDashboardSetup);

// User Account Routes
app.get(`${USERS_API}/user-info/:userId`, verifyScope('USER.V'), routes.userRoutes.getUserInfo);
app.put(`${USERS_API}/user-info/:userId`, verifyScope('USER.U'), routes.userRoutes.updateUserDetails);
app.put(`${USERS_API}/user-password/:userId`, verifyScope('USER.U'), routes.userRoutes.updateUserPassword);

// Error Handler middleware
app.use(errorHandler);

export default app;
