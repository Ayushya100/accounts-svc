'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controllers from '../../controllers/index.js';

const header = 'route: update-account-info';
const msg = 'Update Account info Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controllers.userController;
const paymentController = controllers.paymentController;

// API Function
const updateAccountInfo = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const accountToken = req.params.token;
        const payload = req.body;

        log.info('Call controller function to validate payload');
        const isValidPayload = paymentController.validateUpdateAccountPayload(payload);
        if (!isValidPayload.isValid) {
            throw isValidPayload;
        }

        log.info('Call controller function to check if user exists or not');
        const userAvailable = await userController.checkUserById(userId);
        if (!userAvailable.isValid) {
            throw userAvailable;
        }

        log.info('Call controller function to retrieve the user account info for provided token');
        const accountRecord = await paymentController.getUserAccountByToken(userId, accountToken, null);
        if (!accountRecord.isValid) {
            throw accountRecord;
        }

        log.info('Call controller function to update account information');
        const accountInfo = await paymentController.updateAccountInfo(userId, accountToken, payload);
        if (!accountInfo.isValid) {
            throw accountInfo;
        }

        log.success(`Successfully updated user payment account info in db`);
        res.status(responseCodes[accountInfo.resType]).json(
            buildApiResponse(accountInfo)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with update account info router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default updateAccountInfo;
