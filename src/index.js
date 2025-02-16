'use strict';

import { ServiceConnection } from 'lib-finance-svc';
import app from './app.js';
import dotenv from 'dotenv';
import { serviceConfig } from './constants.js';

dotenv.config({
    path: './env'
});

serviceConfig.HOST = process.env.HOST;
serviceConfig.PORT = process.env.PORT;
serviceConfig.PROTOCOL = process.env.PROTOCOL;
serviceConfig['app'] = app;

const serviceConnection = new ServiceConnection(serviceConfig);

serviceConnection.buildConnection();

serviceConnection.testConnection();
