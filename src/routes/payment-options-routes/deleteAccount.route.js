'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controllers from '../../controllers/index.js';

const header = 'route: delete-account';
const msg = 'Delete Account Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controllers.userController;
const paymentController = controllers.paymentController;

// API Function
const deleteAccountInfo = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const accountToken = req.params.token;

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

        log.info('Call controller function to delete user payment account');
        const updatedAccountInfo = await paymentController.deleteAccountInfo(userId, accountToken);
        if (!updatedAccountInfo.isValid) {
            throw updatedAccountInfo;
        }

        log.success(`Successfully deleted user payment account info in db`);
        res.status(responseCodes[updatedAccountInfo.resType]).json(
            buildApiResponse(updatedAccountInfo)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with delete account router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default deleteAccountInfo;
