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
        router.logInfo('info', `Service is healthy. Uptime : ${process.uptime()} seconds | Timestamp : ${new Date().toISOString()} | Hostname : ${os.hostname()}`);

        res.status(200).json(
            buildApiResponse({
                status: 200,
                data: {
                    uptime: `${String(process.uptime())} seconds`,
                    timestamp: new Date().toISOString(),
                    hostname: os.hostname()
                },
                message: 'Service is healthy.'
            })
        );
    } catch (err) {
        router.logInfo('error', `Health check failed! Error : ${err.message}`);
        next({
            status: 500,
            message: 'Service is unhealthy',
            stack: err.stack
        });
    }
}

export default healthCheck;
