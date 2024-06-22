'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controllers from '../../controllers/index.js';

const header = 'route: get-account-info';
const msg = 'Get Account Info Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controllers.userController;
const paymentController = controllers.paymentController;

// API Function
const getAccountInfo = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const accountToken = req.params.token;
        const filter = req.query.filter;

        log.info('Call controller function to check if user exists or not');
        const userAvailable = await userController.checkUserById(userId);
        if (!userAvailable.isValid) {
            throw userAvailable;
        }

        let accountRecord;
        if (accountToken) {
            log.info('Call controller function to retrieve the user account record for provided token');
            accountRecord = await paymentController.getUserAccountByToken(userId, accountToken, filter);
        } else {
            log.info('Call controller funciton to retrieve all user account records');
            accountRecord = await paymentController.getAllUserAccount(userId, filter);
        }
        if (!accountRecord.isValid) {
            throw accountRecord;
        }

        log.success(`Successfully retrieved account info from db`);
        res.status(responseCodes[accountRecord.resType]).json(
            buildApiResponse(accountRecord)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with get account info router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default getAccountInfo;
