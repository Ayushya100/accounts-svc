'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controllers from '../../controllers/index.js';
import { translate } from '../../utils/index.js';

const header = 'route: deactivate-payment-mode-account';
const msg = 'Deactivate Payment Mode Account Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controllers.userController;
const paymentController = controllers.paymentController;

// API Function
const deactivatePaymentAccount = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const paymentToken = req.params.token;

        log.info('Call controller function to check if user exists or not');
        const userAvailable = await userController.checkUserById(userId);
        if (!userAvailable.isValid) {
            throw userAvailable;
        }

        log.info('Call controller function to retrieve the user payment account info for provided token');
        const paymentAccountRecord = await paymentController.getPaymentAccountByToken(userId, paymentToken, null);
        if (!paymentAccountRecord.isValid) {
            throw paymentAccountRecord;
        }
        if (!paymentAccountRecord.data.isActive) {
            throw {
                resType: 'BAD_REQUEST',
                resMsg: translate('paymentRoutes', 'Already deactive account, cannot proceed to re-deactivate'),
                isValid: false
            };
        }

        log.info('Call controller function to deactivate payment mode account for requested account');
        const updatedAccountInfo = await paymentController.deactivatePaymentAccount(userId, paymentToken);
        if (!updatedAccountInfo.isValid) {
            throw updatedAccountInfo;
        }

        log.success(`Successfully deactivated payment mode account in db`);
        res.status(responseCodes[updatedAccountInfo.resType]).json(
            buildApiResponse(updatedAccountInfo)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with deactivate payment mode account router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default deactivatePaymentAccount;
