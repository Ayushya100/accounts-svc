'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';

const header = 'controller: delete-app-route';
const log = logger(header);

const deleteAppRoute = async(userId, routeId) => {
    try {
        log.info('Execution for deleting app route controller started');
        log.info('Call db query to delete app route from db');
        const appRouteDetails = await dbConnect.deleteAppRouteById(userId, routeId);

        log.info('Execution for deleting app route completed successfully');
        return {
            resType: 'REQUEST_ACCEPTED',
            resMsg: 'App route deleted successfully',
            data: appRouteDetails,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to delete app route');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to delete app route',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    deleteAppRoute
};
