'use strict';

import { Service, verifyUserId } from 'finance-lib';
import dotenv from 'dotenv';
import { USERS_API, serviceConfig } from './constants.js';
import routes from './routes/index.js';

dotenv.config({
  path: './env',
});

class AccountService extends Service {
  registerPublicEndpoints() {
    this.app.get(`${USERS_API}/health`, routes.healthCheck);
    this.app.post(`${USERS_API}/register-user`, routes.users.registerUser);
    this.app.put(`${USERS_API}/verify-user/:userId/:token`, routes.users.verifyUserEmail);
    this.app.post(`${USERS_API}/login`, routes.users.loginUser);
  }

  registerServiceEndpoints() {
    // User Role routes
    this.app.post(`${USERS_API}/setup/user-role`, routes.settingRoutes.registerUserRole);
    this.app.get(`${USERS_API}/setup/user-role`, routes.settingRoutes.getAllUserRoles);
    this.app.get(`${USERS_API}/setup/user-role/:roleId`, routes.settingRoutes.getUserRoleById);
    this.app.put(`${USERS_API}/setup/user-role/:roleId`, routes.settingRoutes.updateUserRole);
    this.app.delete(`${USERS_API}/setup/user-role/:roleId`, routes.settingRoutes.deleteUserRole);

    // User Scope routes
    this.app.post(`${USERS_API}/setup/user-scope`, routes.settingRoutes.registerUserScope);
    this.app.get(`${USERS_API}/setup/user-scope`, routes.settingRoutes.getAllUserScopes);
    this.app.get(`${USERS_API}/setup/user-scope/:scopeId`, routes.settingRoutes.getUserScopeById);
    this.app.put(`${USERS_API}/setup/user-scope/:scopeId`, routes.settingRoutes.updateUserScope);
    this.app.delete(`${USERS_API}/setup/user-scope/:scopeId`, routes.settingRoutes.deleteUserScope);
    this.app.get(`${USERS_API}/setup/assigned-scope/:roleId`, routes.settingRoutes.getAssignedScopes);
    this.app.get(`${USERS_API}/setup/unassigned-scope/:roleId`, routes.settingRoutes.getUnassignedScopes);

    // User routes
    this.app.get(`${USERS_API}/user/:userId`, verifyUserId, routes.users.userInfo);
    this.app.post(`${USERS_API}/user/logout`, routes.users.logoutUser);
  }
}

serviceConfig.HOST = process.env.HOST || serviceConfig.HOST;
serviceConfig.PORT = process.env.PORT || serviceConfig.PORT;
serviceConfig.PROTOCOL = process.env.PROTOCOL || serviceConfig.PROTOCOL;

const service = new AccountService(serviceConfig, true);
service.getUserContext();
service.buildConnection();
service.testConnection();
