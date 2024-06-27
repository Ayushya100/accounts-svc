'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controllers from '../../controllers/index.js';

const header = 'route: get-payment-account-info';
const msg = 'Get Payment Account Info Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controllers.userController;
const paymentController = controllers.paymentController;

// API Function
const getPaymentAccountInfo = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const accountToken = req.params.token;
        const paymentType = req.params.paymentType;
        const filter = req.query.filter;

        log.info('Call controller function to check if user exists or not');
        const userAvailable = await userController.checkUserById(userId);
        if (!userAvailable.isValid) {
            throw userAvailable;
        }

        let accountRecord;
        if (accountToken) {
            log.info('Call controller function to retrieve payment account record for requested account token');
            accountRecord = await paymentController.getPaymentAccountByToken(userId, accountToken, filter);
        } else if (paymentType) {
            log.info(`Call controller function to retrieve payment account records for requested payment type : ${paymentType}`);
            accountRecord = await paymentController.getPaymentAccountByPaymentType(userId, paymentType, filter);
        } else {
            log.info('Call controller function to retrieve all payment account records');
            accountRecord = await paymentController.getAllPaymentAccount(userId, filter);
        }
        if (!accountRecord.isValid) {
            throw accountRecord;
        }

        log.success(`Successfully retrieved payment account info from db`);
        res.status(responseCodes[accountRecord.resType]).json(
            buildApiResponse(accountRecord)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with get payment account info router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default getPaymentAccountInfo;
