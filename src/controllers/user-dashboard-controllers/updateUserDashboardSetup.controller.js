'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-finance-service';

const header = 'controller: update-user-setup-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const updateAllUserDashboardSetup = async(userId, payload, userDashboardSettings) => {
    try {
        log.info('Execution for updating setup records for all settings controller started');
        for (let record of payload.records) {
            let setupRecord = userDashboardSettings.filter(setup => String(setup._id) === record._id);
            if (setupRecord.length === 0) {
                return {
                    resType: 'NOT_FOUND',
                    resMsg: `Provided id is incorrect for which requested value is '${record.value}'`,
                    isValid: false
                };
            }
            setupRecord = setupRecord[0];

            if (typeof record.value !== setupRecord.type) {
                return {
                    resType: 'BAD_REQUEST',
                    resMsg: `Provided value for '${setupRecord.categoryName}' does not match with its type - Cannot proceed with update`,
                    isValid: false
                };
            }
        }

        payload = payload.records;
        log.info('Call db query to update the details of all settings for requested user');
        const updatedSetupDetails = await dbConnect.updateUserDashboardSetting(userId, payload, null, true);

        if (updatedSetupDetails) {
            log.info('Execution for updating user setting records completed successfully');
            return {
                resType: 'REQUEST_COMPLETED',
                resMsg: 'Dashboard settings updated successfully',
                data: updatedSetupDetails,
                isValid: true
            };
        }

        log.error('Some error occurred while updating setting records for provided user');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while updating user setup records',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to update setup records controller');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to update user setup records',
            stack: err.stack,
            isValid: false
        };
    }
}

const updateUserDashboardSetupById = async(userId, settingId, payload, userDashboardSettings) => {
    try {
        log.info('Execution for updating setup record for requested setting id controller started');

        let setupRecord = userDashboardSettings.filter(setup => String(setup._id) === settingId);
        setupRecord = setupRecord[0];

        if (typeof payload.value !== setupRecord.type) {
            return {
                resType: 'BAD_REQUEST',
                resMsg: `Provided value for '${setupRecord.categoryName}' does not match with its type - Cannot proceed with update`,
                isValid: false
            };
        }

        log.info('Call db query to update the detail of requested setting for provided id');
        const updatedSetupDetails = await dbConnect.updateUserDashboardSetting(userId, payload, settingId, false);

        if (updatedSetupDetails) {
            log.info('Execution for updating user setting record completed successfully');
            return {
                resType: 'REQUEST_COMPLETED',
                resMsg: 'Dashboard setting updated successfully',
                data: updatedSetupDetails,
                isValid: true
            };
        }

        log.error(`Error occurred while updating setting record for requested setting id : ${settingId}`);
        return {
            resType: 'NOT_FOUND',
            resMsg: 'No Dashboard Setting Found',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to update requested user setup record controller');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to update user setup record',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    updateAllUserDashboardSetup,
    updateUserDashboardSetupById
};
