'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-finance-service';
import controllers from '../../controllers/index.js';

const header = 'route: get-card-info';
const msg = 'Get Card Info Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userController = controllers.userController;
const paymentController = controllers.paymentController;

// API Function
const getCardInfo = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const cardToken = req.params.token;
        const cardType = req.params.cardType;
        const filter = req.query.filter;

        log.info('Call controller function to check if user exists or not');
        const userAvailable = await userController.checkUserById(userId);
        if (!userAvailable.isValid) {
            throw userAvailable;
        }

        let cardRecord;
        if (cardToken) {
            log.info('Call controller function to retrieve card record for requested card token');
            cardRecord = await paymentController.getCardByToken(userId, cardToken, filter);
        } else if (cardType) {
            log.info(`Call controller function to retrieve card records for requested card type : ${cardType}`);
            cardRecord = await paymentController.getCardByType(userId, cardType, filter);
        } else {
            log.info('Call controller function to retrieve all user card records');
            cardRecord = await paymentController.getAllUserCards(userId, filter);
        }
        if (!cardRecord.isValid) {
            throw cardRecord;
        }

        log.success(`Successfully retrieved card info from db`);
        res.status(responseCodes[cardRecord.resType]).json(
            buildApiResponse(cardRecord)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with get card info router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default getCardInfo;
