'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controllers from '../../controllers/index.js';

const header = 'route: update-payment-account-info';
const msg = 'Update Payment Account info Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controllers.userController;
const paymentController = controllers.paymentController;

// API Function
const updatePaymentAccountInfo = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const paymentToken = req.params.token;
        const payload = req.body;

        log.info('Call controller function to validate payload');
        const isValidPayload = paymentController.validateUpdatePaymentPayload(payload);
        if (!isValidPayload.isValid) {
            throw isValidPayload;
        }

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

        log.info('Call controller function to update payment account information');
        const paymentAccountInfo = await paymentController.updatePaymentAccountInfo(userId, paymentToken, payload);
        if (!paymentAccountInfo.isValid) {
            throw paymentAccountInfo;
        }

        log.success(`Successfully updated user payment option account info in db`);
        res.status(responseCodes[paymentAccountInfo.resType]).json(
            buildApiResponse(paymentAccountInfo)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with update payment account info router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default updatePaymentAccountInfo;
