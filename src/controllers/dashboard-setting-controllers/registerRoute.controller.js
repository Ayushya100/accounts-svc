'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';

const header = 'controller: register-route';

const log = logger(header);

const isRouteAvailable = async(payload) => {
    try {
        log.info('Execution to check for existing route controller started');
        let response = {
            resType: 'SUCCESS',
            resMsg: 'VALIDATION SUCCESSFULL',
            isValid: true
        };

        log.info('Call db query to check for the existing records');
        const routeDetails = await dbConnect.isRouteAvailable(payload);

        if (routeDetails) {
            log.error(`Conflict, record already exists for requested route with end-point : ${payload.path}`);
            response.resType = 'CONFLICT';
            response.resMsg = 'Route already exists with same end-point.';
            response.isValid = false;
        }

        log.info('Execution for checking existing record completed');
        return response;
    } catch (err) {
        log.error(`Error while working with db to check for existing route record : ${err}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to check for existing route record.',
            stack: err.stack,
            isValid: false
        };
    }
}

const createRoute = async(payload) => {
    try {
        log.info('Execution for registering new route controller started');
        log.info('Call db query to register new record');
        const newRoute = await dbConnect.registerNewRoute(payload);
        
        log.success('Execution for new record completed');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'Route Created Successfully',
            data: newRoute,
            isValid: true
        };
    } catch (err) {
        log.error(`Error while working with db to register new route record : ${err}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to register new route.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    isRouteAvailable,
    createRoute
};
