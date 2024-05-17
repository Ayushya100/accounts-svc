'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';

const header = 'controller: shared-service-controller';
const log = logger(header);

const isDefaultUserAvailable = async() => {
    try {
        log.info('Execution to check for default user role controller started');
        let response = {
            resType: 'SUCCESS',
            resMsg: 'VALIDATION SUCCESSFULL',
            isValid: true
        };

        log.info('Call db query to check for the existing default user role record');
        const routeDetails = await dbConnect.isDefaultUserRoleAvailable();
        if (!routeDetails) {
            log.error(`Default user role not found`);
            response.resType = 'NOT_FOUND';
            response.resMsg = 'Default user role not found';
            response.isValid = false;
        }
        
        log.info('Execution for checking existing default user role completed');
        return response;
    } catch (err) {
        log.error(`Error while working with db to check for default user role record : ${err}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to check for default user role record.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    isDefaultUserAvailable
};
