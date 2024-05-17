'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';

const header = 'controller: update-app-route';
const log = logger(header);

const updateAppRoute = async(userId, routeId, payload, routeInfo) => {
    try {
        log.info('Execution for updating app route info controller started');
        const queryPayload = {
            path: payload.path || routeInfo.path,
            microservice: payload.microservice || routeInfo.microservice,
            port: payload.port || routeInfo.port,
            method: payload.method || routeInfo.method,
            validations: payload.validations || routeInfo.validations
        };

        log.info('Call db query to update app route info');
        const appRouteDetails = await dbConnect.updateAppRouteById(userId, routeId, queryPayload);

        log.info('Execution for updating app route info completed successfully');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'App route updated',
            data: appRouteDetails,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to update the app route record');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to update app route',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    updateAppRoute
};
