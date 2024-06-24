'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-finance-service';
import { translate } from '../../utils/index.js';

const header = 'controller: get-system-setup-controller';
const log = logger(header);

const getSystemSetup = async() => {
    try {
        log.info('Execution for retrieving setup info for SYSTEM controller started');
        const fieldsToRetrieve = [
            'application-title', 'application-quote', 'user-theme', 'user-language'
        ];

        log.info('Call db query to get the details of setup for SYSTEM');
        let setupDetails = await dbConnect.getSystemUserSettingInfo(fieldsToRetrieve);
        setupDetails = setupDetails.map(val => ({
            _id: val._id,
            categoryName: val.categoryName,
            categoryDescription: val.categoryDescription,
            categoryType: val.categoryType,
            subCategory: val.subCategory,
            type: val.type,
            isPeriodic: val.isPeriodic,
            duration: val.duration,
            value: val.default
        }));

        if (setupDetails.length > 0) {
            log.info('Execution for retrieving setup info for SYSTEM completed successfully');
            return {
                resType: 'SUCCESS',
                resMsg: translate('userSettingRoutes', 'System setup details retrieved successfully'),
                data: setupDetails,
                isValid: true
            };
        }

        log.error('No setup info found for SYSTEM');
        return {
            resType: 'NOT_FOUND',
            resMsg: translate('userSettingRoutes', 'No System Setup Found'),
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to get all setup records for SYSTEM');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('userSettingRoutes', 'Some error occurred while working with db to get setup records for SYSTEM'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getSystemSetup
};
