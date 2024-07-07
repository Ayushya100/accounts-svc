'use strict';

import { dbConnection, logger } from 'lib-finance-service';
import app from './app.js';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config({
    path: './env'
});

const log = logger('service-connection');

const options = {
    key: process.env.SSL_KEY,
    cert: process.env.SSL_CERT
};
const HTTP_PORT = process.env.PORT || 4800;
const HTTPS_PORT = process.env.HTTPS_PORT || 7200;

dbConnection()
.then(() => {
    app.listen(HTTP_PORT, () => {
        log.info(`Server is running on PORT: ${HTTP_PORT}`);
    });
    https.createServer(options, app).listen(HTTPS_PORT, () => {
        log.info(`Account management HTTPS Server is running on PORT: ${HTTPS_PORT}`);
    });
}).catch((err) => {
    log.error(`DB Connection Failed!, ${err}`);
});
