'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controllers from '../../controllers/index.js';

const header = 'route: delete-payment-mode-account';
const msg = 'Delete Payment mode Account Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controllers.userController;
const paymentController = controllers.paymentController;

// API Function
const deletePaymentAccountInfo = async(req, res, next) => {
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

        log.info('Call controller function to delete user payment mode account');
        const updatedAccountInfo = await paymentController.deletePaymentAccountInfo(userId, paymentToken);
        if (!updatedAccountInfo.isValid) {
            throw updatedAccountInfo;
        }

        log.success(`Successfully deleted user payment mode account info in db`);
        res.status(responseCodes[updatedAccountInfo.resType]).json(
            buildApiResponse(updatedAccountInfo)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with delete payment mode account router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default deletePaymentAccountInfo;
