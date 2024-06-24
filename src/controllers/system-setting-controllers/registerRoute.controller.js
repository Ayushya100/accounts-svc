'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';
import { translate } from '../../utils/index.js';

const header = 'controller: register-route';

const log = logger(header);

const isRouteAvailable = async(payload) => {
    try {
        log.info('Execution to check for the records of existing route controller started');
        let response = {
            resType: 'REQUEST_COMPLETED',
            resMsg: translate('settingRoutes', 'VALIDATION SUCCESSFULL'),
            data: null,
            isValid: true
        };

        log.info('Call db query to check for the existing records');
        const routeDetails = await dbConnect.isRouteAvailable(payload);
        
        if (routeDetails && !routeDetails.isDeleted) {
            log.error(`Conflict, record already exists for requested route with provided end-point : ${payload.path}`);
            response.resType = 'CONFLICT';
            response.resMsg = translate('settingRoutes', 'Route already exists with same end-point');
            response.isValid = false;
        } else if (routeDetails && routeDetails.isDeleted) {
            log.error(`Route already exists but is deleted, need to restore or update the route with provided endpoint`);
            response.resType = 'SUCCESS';
            response.resMsg = translate('settingRoutes', 'Route already exists but is deleted');
            response.data = routeDetails;
            response.isValid = false;
        }

        log.info('Execution for checking existing route record completed');
        return response;
    } catch (err) {
        log.error(`Error while working with db to check for existing route record : ${err}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('settingRoutes', 'Some error occurred while working with db to check for existing route record'),
            stack: err.stack,
            isValid: false
        };
    }
}

const createRoute = async(payload) => {
    try {
        log.info('Execution for registering new route controller started');
        log.info('Call db query to register new record');
        const newRoute = await dbConnect.createNewRoute(payload);
        
        log.success('Execution for registering new route record completed');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: translate('settingRoutes', 'Route Created Successfully'),
            data: newRoute,
            isValid: true
        };
    } catch (err) {
        log.error(`Error while working with db to register new route record : ${err}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('settingRoutes', 'Some error occurred while working with db to register new route'),
            stack: err.stack,
            isValid: false
        };
    }
}

const restoreRoute = async(userId, route) => {
    try {
        log.info('Execution for restoring deleted route controller started');
        log.info('Call db query to restore deleted route');
        const updatedRoute = await dbConnect.restoreRoute(userId, route);

        log.success('Execution for restoring deleted route record completed');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: translate('settingRoutes', 'Route Restored Successfully'),
            data: updatedRoute,
            isValid: true
        };
    } catch (err) {
        log.error(`Error while working with db to restore deleted route record : ${err}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('settingRoutes', 'Some error occurred while working with db to restore deleted route'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    isRouteAvailable,
    createRoute,
    restoreRoute
};
