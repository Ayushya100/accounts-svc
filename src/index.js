'use strict';

import { Service } from 'common-svc-lib';
import { SVC_API, serviceConfig } from './constants.js';
import routes from './routes/index.js';

class AccountService extends Service {
  registerPublicEndpoints() {
    this.app.get(`${SVC_API}/health`, routes.healthCheck);
    this.app.post(`${SVC_API}/auth/register`, routes.accountRoutes.registerUser);
    this.app.post(`${SVC_API}/auth/verify/email`, routes.accountRoutes.verifyUser);
    this.app.post(`${SVC_API}/auth/login`, routes.accountRoutes.loginUser);
    this.app.post(`${SVC_API}/auth/token/refresh`, routes.accountRoutes.refreshToken);
    this.app.post(`${SVC_API}/auth/password/forgot`, routes.accountRoutes.forgotPassword);
    this.app.post(`${SVC_API}/auth/password/reset`, routes.accountRoutes.requestResetPassword);
  }

  registerPrivateEndpoints() {
    // User Routes
    this.app.get(`${SVC_API}/users/me`, routes.accountRoutes.userInfo);
    this.app.put(`${SVC_API}/auth/logout`, routes.accountRoutes.logoutUser);
    this.app.patch(`${SVC_API}/auth/password/change`, routes.accountRoutes.changePassword);
    this.app.get(`${SVC_API}/admin/users`, routes.accountRoutes.getAllUsers);
    this.app.get(`${SVC_API}/admin/users/:userId`, routes.accountRoutes.getUserDtlById);

    // User Role Routes
    this.app.post(`${SVC_API}/setup/role`, routes.settingRoutes.registerUserRole);
    this.app.get(`${SVC_API}/setup/role`, routes.settingRoutes.getUserRole);
    this.app.get(`${SVC_API}/setup/role/:roleId`, routes.settingRoutes.getUserRole);
    this.app.put(`${SVC_API}/setup/role/:roleId`, routes.settingRoutes.updateUserRole);
    this.app.delete(`${SVC_API}/setup/role/:roleId`, routes.settingRoutes.deleteUserRole);

    // User Scope Routes
    this.app.post(`${SVC_API}/setup/scope`, routes.settingRoutes.registerUserScope);
    this.app.get(`${SVC_API}/setup/scope`, routes.settingRoutes.getUserScope);
    this.app.get(`${SVC_API}/setup/scope/:scopeId`, routes.settingRoutes.getUserScope);
    this.app.put(`${SVC_API}/setup/scope/:scopeId`, routes.settingRoutes.updateUserScope);
    this.app.delete(`${SVC_API}/setup/scope/:scopeId`, routes.settingRoutes.deleteUserScope);
    this.app.get(`${SVC_API}/setup/role/:roleId/scopes`, routes.settingRoutes.getScopeList);
    this.app.put(`${SVC_API}/setup/role/:roleId/scopes`, routes.settingRoutes.assignScopes);
  }
}

serviceConfig.HOST = process.env.HOST;
serviceConfig.PORT = process.env.PORT;
serviceConfig.PROTOCOL = process.env.PROTOCOL;

const service = new AccountService(serviceConfig);
service.buildConnection();
service.testConnection();
