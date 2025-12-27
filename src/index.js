'use strict';

import { Service } from 'common-svc-lib';
import { SVC_API, serviceConfig } from './constants.js';
import routes from './routes/index.js';

class AccountService extends Service {
  registerPublicEndpoints() {
    this.app.get(`${SVC_API}/health`, routes.healthCheck);

    this.app.post(`${SVC_API}/setup/role`, routes.settingRoutes.registerUserRole);
  }

  registerPrivateEndpoints() {}
}

serviceConfig.HOST = process.env.HOST;
serviceConfig.PORT = process.env.PORT;
serviceConfig.PROTOCOL = process.env.PROTOCOL;

const service = new AccountService(serviceConfig);
service.buildConnection();
service.testConnection();
