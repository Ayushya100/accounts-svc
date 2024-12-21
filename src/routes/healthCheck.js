'use strict';

import os from 'os';
import { Router, buildApiResponse } from 'lib-finance-svc';

const router = new Router('route: health-check');

// API Function
const healthCheck = (req, res, next) => {
    try {
        router.logRequest(req);
        router.logInfo('success', 'Health check successful');
        router.logInfo('info', `Service is healthy. Uptime: ${process.uptime()} seconds | Timestamp: ${Date.now()} | Hostname: ${os.hostname()}`);

        res.status(200).json(
            buildApiResponse({
                resType: 'SUCCESS',
                data: {
                    uptime: process.uptime(),
                    timestamp: Date.now(),
                    hostname: os.hostname()
                },
                resMsg: 'Service is healthy.'
            })
        );
    } catch (err) {
        router.logInfo('error', `Health check failed : ${err.message}`);
        next({
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Service is unhealthy.',
            stack: err.stack
        });
    }
}

export default healthCheck;
