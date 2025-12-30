'use strict';

import { Service } from 'common-svc-lib';
import { SVC_API, serviceConfig } from './constants.js';
import routes from './routes/index.js';

class AccountService extends Service {
  registerPublicEndpoints() {
    this.app.get(`${SVC_API}/health`, routes.healthCheck);
    this.app.post(`${SVC_API}/register-user`, routes.accountRoutes.registerUser);
    this.app.put(`${SVC_API}/verify-user/:userId/:token`, routes.accountRoutes.verifyUser);
    this.app.post(`${SVC_API}/login`, routes.accountRoutes.loginUser);

    // User Role Routes
    this.app.post(`${SVC_API}/setup/role`, routes.settingRoutes.registerUserRole);
    this.app.get(`${SVC_API}/setup/role`, routes.settingRoutes.getUserRole);
    this.app.get(`${SVC_API}/setup/role/:roleId`, routes.settingRoutes.getUserRole);
  }

  registerPrivateEndpoints() {}
}

serviceConfig.HOST = process.env.HOST;
serviceConfig.PORT = process.env.PORT;
serviceConfig.PROTOCOL = process.env.PROTOCOL;

const service = new AccountService(serviceConfig);
service.buildConnection();
service.testConnection();
