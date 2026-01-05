'use strict';

import { Service } from 'common-svc-lib';
import { SVC_API, serviceConfig } from './constants.js';
import routes from './routes/index.js';

class AccountService extends Service {
  registerPublicEndpoints() {
    this.app.get(`${SVC_API}/health`, routes.healthCheck);
    this.app.post(`${SVC_API}/auth/register`, routes.accountRoutes.registerUser);
    this.app.put(`${SVC_API}/auth/verify-email/:userId/:token`, routes.accountRoutes.verifyUser);
    this.app.post(`${SVC_API}/auth/login`, routes.accountRoutes.loginUser);
    this.app.post(`${SVC_API}/auth/refresh`, routes.accountRoutes.refreshToken);
  }

  registerPrivateEndpoints() {
    // User Routes
    this.app.get(`${SVC_API}/users/me`, routes.accountRoutes.userInfo);
    this.app.put(`${SVC_API}/auth/logout`, routes.accountRoutes.logoutUser);

    // User Role Routes
    this.app.post(`${SVC_API}/setup/role`, routes.settingRoutes.registerUserRole);
    this.app.get(`${SVC_API}/setup/role`, routes.settingRoutes.getUserRole);
    this.app.get(`${SVC_API}/setup/role/:roleId`, routes.settingRoutes.getUserRole);

    // User Scope Routes
    this.app.post(`${SVC_API}/setup/scope`, routes.settingRoutes.registerUserScope);
  }
}

serviceConfig.HOST = process.env.HOST;
serviceConfig.PORT = process.env.PORT;
serviceConfig.PROTOCOL = process.env.PROTOCOL;

const service = new AccountService(serviceConfig);
service.buildConnection();
service.testConnection();
