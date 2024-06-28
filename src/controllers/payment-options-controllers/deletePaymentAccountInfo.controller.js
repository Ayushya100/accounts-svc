'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-finance-service';
import { translate } from '../../utils/index.js';

const header = 'controller: delete-payment-mode-account-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const deletePaymentAccountInfo = async(userId, accountToken) => {
    registerLog.createDebugLog('Start deleting pyament mode account info in system started');

    try {
        log.info('Execution for deleting payment mode account started');
        log.info('Call db query to delete payment mode account info');
        const updatedAccountInfo = await dbConnect.deletePaymentAccountByToken(userId, accountToken);
        if (updatedAccountInfo) {
            log.info('Execution for deleting payment mode account info in db completed successfully');
            return {
                resType: 'REQUEST_ACCEPTED',
                resMsg: translate('paymentRoutes', 'Account deleted successfully'),
                data: updatedAccountInfo,
                isValid: true
            };
        }

        log.error('Error while deleting payment mode account info in database');
        return {
            resType: 'NOT_FOUND',
            resMsg: translate('paymentRoutes', 'Account not found to delete'),
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to delete payment mode account info');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to delete payment mode account info'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    deletePaymentAccountInfo
};
