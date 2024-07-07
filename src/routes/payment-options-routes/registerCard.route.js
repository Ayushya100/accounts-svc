'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controllers from '../../controllers/index.js';
import { sendMail, translate } from '../../utils/index.js';

const header = 'route: register-card';
const msg = 'Register Card Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controllers.userController;
const paymentController = controllers.paymentController;

// API Function
const registerCard = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const payload = req.body;

        log.info('Call controller function to validate payload');
        const isValidPayload = paymentController.validateRegisterCardPayload(payload);
        if (!isValidPayload.isValid) {
            throw isValidPayload;
        }

        log.info('Call controller function to check if user exists or not');
        const userAvailable = await userController.checkUserById(userId);
        if (!userAvailable.isValid) {
            throw userAvailable;
        }

        log.info('Call controller function to check if card for provided card number exists or not');
        const cardAvailable = await paymentController.checkCardByCardNumber(payload.cardNumber);
        if (!cardAvailable.isValid) {
            throw cardAvailable;
        }

        const cardType = payload.cardType.toUpperCase();
        const availableCardType = ['CREDIT', 'DEBIT', 'STORE_CREDIT', 'CORPORATE_CREDIT', 'PROCUREMENT', 'HEALTH_SAVINGS',  'INSURANCE'];
        let accountToken;
        let accountRecord;
        let accountId = null;

        if (availableCardType.includes(cardType)) {
            accountToken = payload.accountToken;
            log.info('Call controller function to retrieve the user account info for provided token');
            accountRecord = await paymentController.getUserAccountByToken(userId, accountToken, JSON.stringify({
                'fields': 'userId token accountType'
            }));
            if (!accountRecord.isValid) {
                throw accountRecord;
            }
            accountId = accountRecord.data._id;

            if ((payload.cardType.toUpperCase() === 'HEALTH_SAVINGS' && accountRecord.data.accountType !== 'HEALTH_SAVINGS') ||
            (payload.cardType.toUpperCase() === 'INSURANCE' && accountRecord.data.accountType !== 'INSURANCE')) {
                throw {
                    resType: 'BAD_REQUEST',
                    resMsg: translate('paymentRoutes', 'Provided linkage account is not of valid type to assign to the new card'),
                    isValid: false
                };
            }
        }

        log.info('Call controller function to register new card for user');
        const cardInfo = await paymentController.registerCard(userId, accountId, payload);
        if (!cardInfo.isValid) {
            throw cardInfo;
        }

        registerLog.createInfoLog('New card registered successfully');
        log.info('Call controller function to build payload to be send to user for card creation confirmation');
        const mailPayload = paymentController.sendCardCreationMailPayload(userAvailable.data, cardInfo.data);

        const mailResponse = await sendMail(req.protocol, mailPayload);
        cardInfo.resMsg = `${cardInfo.resMsg} - ${mailResponse.message}`;

        log.success(`Successfully registered new card in db`);
        res.status(responseCodes[cardInfo.resType]).json(
            buildApiResponse(cardInfo)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with register card router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default registerCard;
