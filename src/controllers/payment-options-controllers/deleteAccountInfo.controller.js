'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-finance-service';
import { translate } from '../../utils/i18n.js';

const header = 'controller: delete-account-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const deleteAccountInfo = async(userId, accountToken) => {
    registerLog.createDebugLog('Start soft deleting account info in system started');

    try {
        log.info('Execution for deleting payment account started');
        log.info('Call db query to delete account info');
        const updatedAccountInfo = await dbConnect.deleteAccountByToken(userId, accountToken);
        if (updatedAccountInfo) {
            log.info('Execution for deleting payment account info in db completed successfully');
            return {
                resType: 'REQUEST_ACCEPTED',
                resMsg: translate('paymentRoutes', 'Account deleted successfully'),
                data: updatedAccountInfo,
                isValid: true
            };
        }

        log.error('Error while deleting payment account info in database');
        return {
            resType: 'NOT_FOUND',
            resMsg: translate('paymentRoutes', 'Account not found to delete'),
            isValid: false
        }
    } catch (err) {
        log.error('Error while working with db to delete payment account info');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to delete payment account info'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    deleteAccountInfo
};
