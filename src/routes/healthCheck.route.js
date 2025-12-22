'use strict';

import os from 'os';
import { logger, ResponseBuilder } from 'common-svc-lib';

const log = logger('Router: health-check');

// API Function
const healthCheck = (req, res, next) => {
  try {
    log.info('Health check successfully');
    log.info(`Service is healthy. Uptime : ${process.uptime()} seconds | Timestamp : ${new Date().toISOString()} | Hostname : ${os.hostname()}`);

    res.status(200).json(
      ResponseBuilder({
        status: 200,
        message: 'Service is healthy',
        data: {
          uptime: `${String(process.uptime())} seconds`,
          timestamp: new Date().toISOString(),
          hostname: os.hostname(),
        },
      })
    );
  } catch (err) {
    log.error(`Health check failed! Error: ${err.message}`);
    next({
      status: 500,
      message: 'Service is unhealthy',
      errors: err,
    });
  }
};

export default healthCheck;
