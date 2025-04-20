'use strict';

import { Service } from 'finance-lib';
import dotenv from 'dotenv';
import { USERS_API, serviceConfig } from './constants.js';
import routes from './routes/index.js';

dotenv.config({
  path: './env',
});

class AccountService extends Service {
  registerServiceEndpoints() {
    this.app.get(`${USERS_API}/health`, routes.healthCheck);
  }
}

serviceConfig.HOST = process.env.HOST || serviceConfig.HOST;
serviceConfig.PORT = process.env.PORT || serviceConfig.PORT;
serviceConfig.PROTOCOL = process.env.PROTOCOL || serviceConfig.PROTOCOL;

const service = new AccountService(serviceConfig, true);
service.getUserContext();
service.buildConnection();
service.testConnection();
