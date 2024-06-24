'use strict';

import dbConnect from '../../db/index.js';
import { createNewLog, logger } from 'lib-finance-service';
import { translate } from '../../utils/index.js';

const header = 'controller: get-user-dtl-info-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const getUserDtlInfo = async(userId) => {
    registerLog.createDebugLog('Start retrieving user info for provided id');

    try {
        log.info(`Execution for retrieving user detail info for provided id (${userId}) started`);
        
        log.info('Call db query to retrieve the user info');
        let userRecord = await dbConnect.getUserFullDetails(userId);

        if (userRecord) {
            log.info('Execution for retrieving user detail record completed successfully');
            const additionalData = await dbConnect.getUserSetupInfo(userId, userRecord.roleId);
            userRecord = userRecord.toObject();
            delete userRecord.password;

            return {
                resType: 'SUCCESS',
                resMsg: translate('userRoutes', 'User Info found'),
                data: {
                    userRecord: userRecord,
                    userRole: additionalData.userRole.roleCode,
                    userScopes: additionalData.userScopes,
                    userSetup: additionalData.userSetup.map(setupDetail => ({
                        categoryName: setupDetail.categoryName,
                        categoryDescription: setupDetail.categoryDescription,
                        value: setupDetail.value
                    }))
                },
                isValid: true
            };
        }

        log.error('No user record found');
        return {
            resType: 'NOT_FOUND',
            resMsg:  translate('userRoutes', 'User not found'),
            data: null,
            isValid: false
        };
    } catch(err) {
        log.error(`Error while working with db to retrieve user detail info for provided id : ${userId}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('userRoutes', 'Some error occurred while working with db to get the details for requested user'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getUserDtlInfo
};
