'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';

const header = 'controller: get-system-setup-controller';
const log = logger(header);

const getSystemSetup = async() => {
    try {
        log.info('Execution for retrieving setup info for SYSTEM user controller started');
        const fieldsToRetrieve = [
            'application-title', 'application-quote', 'user-theme', 'user-language'
        ];

        log.info('Call db query to get the details of setup for SYSTEM user');
        const setupDetails = await dbConnect.getSystemUserSettingInfo(fieldsToRetrieve);

        if (setupDetails.length > 0) {
            log.info('Execution for retrieving setup info for SYSTEM user completed successfully');
            return {
                resType: 'SUCCESS',
                resMsg: 'System setup details retrieved successfully',
                data: setupDetails,
                isValid: true
            };
        }

        log.error('No setup info found for SYSTEM user');
        return {
            resType: 'NOT_FOUND',
            resMsg: 'No System Setup Found',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to get all setup records for SYSTEM user');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to get setup records for SYSTEM user',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getSystemSetup
};
