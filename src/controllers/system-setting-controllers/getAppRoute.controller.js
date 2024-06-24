'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';
import { translate } from '../../utils/index.js';

const header = 'controller: get-app-route-info';
const log = logger(header);

const getAllAppRouteInfo = async() => {
    try {
        log.info('Execution for retrieving all app routes controller started');
        log.info('Call db query to get the details of all app routes');
        const appRouteDetails = await dbConnect.getAllAppRoute();

        if (appRouteDetails.length === 0) {
            log.info('No app route info available');
            return {
                resType: 'CONTENT_NOT_AVAILABLE',
                resMsg: translate('settingRoutes', 'No App route records found'),
                data: [],
                isValid: true
            };
        }

        log.info('Execution for retrieving all app route info completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: translate('settingRoutes', 'App routes found'),
            data: appRouteDetails,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to get all app routes');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('settingRoutes', 'Some error occurred while working with db to retrieve app routes'),
            stack: err.stack,
            isValid: false
        };
    }
}

const getAppRoutebyId = async(routeId) => {
    try {
        log.info(`Execution for retrieving app route info for provided route id (${routeId}) controller started`);
        log.info('Call db query to get the details of app route for requested id');
        const appRouteDetails = await dbConnect.getAppRouteById(routeId);

        if (!appRouteDetails || appRouteDetails.length === 0) {
            log.error('No information found for requested route');
            return {
                resType: 'NOT_FOUND',
                resMsg: 'App route not found',
                isValid: false
            };
        }

        log.success(`Execution for retrieving app route info for provided route id (${routeId}) completed successfully`);
        return {
            resType: 'SUCCESS',
            resMsg: 'App route retrieved successfully',
            data: appRouteDetails,
            isValid: true
        };
    } catch (err) {
        log.error(`Error while working with db to get app route info for requested id : ${routeId}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to retrieve record of app route for provided id',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getAllAppRouteInfo,
    getAppRoutebyId
};
