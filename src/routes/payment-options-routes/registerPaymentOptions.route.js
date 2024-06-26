'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controllers from '../../controllers/index.js';
import { translate } from '../../utils/index.js';

const header = 'route: register-payment-method';
const msg = 'Register Payment Method Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controllers.userController;
const paymentController = controllers.paymentController;

// API Function
const registerPaymentMethod = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const payload = req.body;

        log.info('Call controller funciton to validate payload');
        const isValidPayload = paymentController.validateRegisterPaymentPayload(payload);
        if (!isValidPayload.isValid) {
            throw isValidPayload;
        }

        log.info('Call controller function to check if user exists or not');
        const userAvailable = await userController.checkUserById(userId);
        if (!userAvailable.isValid) {
            throw userAvailable;
        }
        
        const paymentType = payload.paymentType.toUpperCase();
        const availableAccountType = ['UPI', 'INTERNET-BANKING', 'MOBILE-BANKING', 'CHEQUE', 'DEMAND-DRAFT'];
        
        let accountToken;
        let accountRecord;
        let accountId;

        if (availableAccountType.includes(paymentType)) {
            accountToken = payload.accountToken;
            log.info('Call controller function to retrieve the user account info for provided token');
            accountRecord = await paymentController.getUserAccountByToken(userId, accountToken, JSON.stringify({
                'fields': 'userId token accountType'
            }));
            if (!accountRecord.isValid) {
                throw accountRecord;
            }

            const validAccountTypes = ['SAVINGS', 'CURRENT', 'SALARY'];
            if (!validAccountTypes.includes(accountRecord.data.accountType)) {
                throw {
                    resType: 'BAD_REQUEST',
                    resMsg: translate('paymentRoutes', 'Not valid account type'),
                    isValid: false
                };
            }
            accountId = accountRecord.data._id;
        }

        log.info('Call controller funciton to check if payment account for provided information exists');
        const paymentAccountAvailable = await paymentController.checkPaymentOptionAccount(userId, accountId, payload);
        if (!paymentAccountAvailable.isValid) {
            throw paymentAccountAvailable;
        }

        log.info('Call controller function to create new payment mode account for user');
        const accountInfo = await paymentController.registerPaymentOptionAccount(userId, accountId, payload);
        if (!accountInfo.isValid) {
            throw accountInfo;
        }

        log.success(`Successfully registered new payment method in db`);
        res.status(responseCodes[accountInfo.resType]).json(
            buildApiResponse(accountInfo)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with register payment method router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default registerPaymentMethod;
