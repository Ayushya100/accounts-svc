'use strict';

import os from 'os';
import { Router, buildApiResponse } from 'lib-finance-svc';

const router = new Router('health-check');

// API Function
const healthCheck = (req, res, next) => {
    try {
        router.logMsg();
        router.logRequest(req);
        router.logInfo('success', 'Health check successful');
        router.logInfo('info', `Service is healthy. Uptime : ${process.uptime()} seconds | Timestamp : ${Date.now()} | Hostname : ${os.hostname()}`);

        res.status(200).json(
            buildApiResponse({
                resCode: 200,
                data: {
                    uptime: process.uptime(),
                    timestamp: Date.now(),
                    hostname: os.hostname()
                },
                resMsg: 'Service is healthy.'
            })
        );
    } catch (err) {
        router.logInfo('error', `Health check failed! Error : ${err.message}`);
        next({
            resCode: 500,
            resMsg: 'Service is unhealthy',
            stack: err.stack
        });
    }
}

export default healthCheck;
