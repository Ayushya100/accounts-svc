'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controllers from '../../controllers/index.js';
import { translate } from '../../utils/index.js';

const header = 'route: deactivate-account';
const msg = 'Deactivate Account Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controllers.userController;
const paymentController = controllers.paymentController;

// API Function
const deactivateAccount = async(req, res, next) => {
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
        const userAccountRecord = await paymentController.getUserAccountByToken(userId, accountToken, null);
        if (!userAccountRecord.isValid) {
            throw userAccountRecord;
        }
        if (!userAccountRecord.data.isActive) {
            throw {
                resType: 'BAD_REQUEST',
                resMsg: translate('paymentRoutes', 'Already deactive account, cannot proceed to re-deactivate'),
                isValid: false
            };
        }

        log.info('Call controller function to deactivate payment account for requested account');
        const updatedAccountInfo = await paymentController.deactivateAccount(userId, accountToken);
        if (!updatedAccountInfo.isValid) {
            throw updatedAccountInfo;
        }
        
        log.success(`Successfully deactivated account in db`);
        res.status(responseCodes[updatedAccountInfo.resType]).json(
            buildApiResponse(updatedAccountInfo)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with deactivate account router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default deactivateAccount;
