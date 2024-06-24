'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';
import { translate } from '../../utils/index.js';

const header = 'controller: shared-service-controller';
const log = logger(header);

const isDefaultUserAvailable = async() => {
    try {
        log.info('Execution to check for default user role controller started');
        let response = {
            resType: 'SUCCESS',
            resMsg: translate('settingRoutes', 'VALIDATION SUCCESSFULL'),
            isValid: true
        };

        log.info('Call db query to check for the existing default user role record');
        const routeDetails = await dbConnect.isDefaultUserRoleAvailable();
        if (!routeDetails) {
            log.error(`Default user role not found`);
            response.resType = 'NOT_FOUND';
            response.resMsg = translate('settingRoutes', 'Default user role not found');
            response.isValid = false;
        }
        
        log.info('Execution for checking existing default user role completed');
        return response;
    } catch (err) {
        log.error(`Error while working with db to check for default user role record : ${err}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('settingRoutes', 'Some error occurred while working with db to check for default user role record'),
            stack: err.stack,
            isValid: false
        };
    }
}

const isUserRoleByIdAvailable = async(roleId) => {
    try {
        log.info('Execution to check for user role for provided id controller started');
        let response = {
            resType: 'SUCCESS',
            resMsg: translate('settingRoutes', 'VALIDATION SUCCESSFULL'),
            isValid: true
        };

        log.info('Call db query to check for the user role record with provided id');
        const routeDetails = await dbConnect.isUserRoleByIdAvailable(roleId);
        if (!routeDetails) {
            log.error(`User role for provided id (${roleId}) not found`);
            response.resType = 'NOT_FOUND';
            response.resMsg = translate('settingRoutes', 'User role not found');
            response.isValid = false;
        }
        
        log.info('Execution for checking user role with provided id completed');
        return response;
    } catch (err) {
        log.error(`Error while working with db to check for user role record : ${err}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('settingRoutes', 'Some error occurred while working with db to check for user role record'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    isDefaultUserAvailable,
    isUserRoleByIdAvailable
};
