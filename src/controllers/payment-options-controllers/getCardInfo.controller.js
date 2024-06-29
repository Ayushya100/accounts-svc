'use strict';

import { logger, createNewLog } from 'lib-finance-service';
import dbConnect from '../../db/index.js';
import { decryptPaymentData, encryptPaymentData, filterFields, maskPaymentNumber, translate } from '../../utils/index.js';

const header = 'controller: get-card-info';

const log = logger(header);
const registerLog = createNewLog(header);

const formatResponse = (cardInfo) => {
    const fields = ['cardNumber', 'cardType', 'expirationDate', 'holderName'];
    for (const field of fields) {
        if (cardInfo[field]) {
            cardInfo[field] = decryptPaymentData(cardInfo[field], 'PAYMENT');
        }
    }

    if (cardInfo.cardNumber) {
        cardInfo.cardNumber = maskPaymentNumber(cardInfo.cardNumber);
    }
    return cardInfo;
}

const getAllUserCards = async(userId, filterOptions) => {
    registerLog.createDebugLog('Start retrieving all user card info for requested user');

    try {
        log.info('Execution for retrieving user card informations started');
        const cardFields = filterOptions ? filterFields(filterOptions) : null;

        log.info('Call db query to retrieve all user cards');
        let userCards = await dbConnect.getAllUserCards(userId, cardFields);
        if (userCards.length > 0) {
            log.info('Data format into readable format started');
            userCards.forEach(cardInfo => {
                cardInfo = formatResponse(cardInfo)
            });

            log.info('Execution for retrieving user card information retrieved successfully');
            return {
                resType: 'SUCCESS',
                resMsg: translate('paymentRoutes', 'User card retrieved successfully'),
                data: userCards,
                isValid: true
            };
        }

        log.info('No user card information found');
        return {
            resType: 'CONTENT_NOT_AVAILABLE',
            resMsg: translate('paymentRoutes', 'No user card information found'),
            isValid: true
        }
    } catch (err) {
        log.error(`Error while working with db for retrieveing all card info for requested user : ${userId}`);
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to retrieve all user card info for requested user'),
            stack: err.stack,
            isValid: false
        };
    }
}

const getCardByToken = async(userId, cardToken, filterOptions) => {
    registerLog.createDebugLog('Start retrieving card info for requested card token');

    try {
        log.info('Execution for retrieving card information started');
        const cardFields = filterOptions ? filterFields(filterOptions) : null;

        log.info('Call db query to retrieve user card information started');
        let userCard = await dbConnect.getCardByToken(userId, cardToken, cardFields);
        if (userCard) {
            log.info('Data format into readable format started');
            userCard = formatResponse(userCard);

            log.info('Execution for retrieving card information completed successfully');
            return {
                resType: 'SUCCESS',
                resMsg: translate('paymentRoutes', 'User card information retrieved successfully'),
                data: userCard,
                isValid: true
            };
        }

        log.error('No user card information found');
        return {
            resType: 'NOT_FOUND',
            resMsg: translate('paymentRoutes', 'No user card information found'),
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db for retrieveing card info for requested card');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to retrieve user card info for requested token'),
            stack: err.stack,
            isValid: false
        };
    }
}

const getCardByType = async(userId, cardType, filterOptions) => {
    registerLog.createDebugLog('Start retrieving card info for requested card type');

    try {
        log.info('Execution for retrieving user card information started');
        const validFields = [
            'CREDIT',
            'DEBIT',
            'PREPAID',
            'MEAL',
            'RESTAURANT',
            'PUBLIC_TRANSIT',
            'TRAVEL',
            'GIFT',
            'STORE_CREDIT',
            'CORPORATE_CREDIT',
            'PROCUREMENT',
            'HEALTH_SAVINGS',
            'INSURANCE',
            'FUEL',
            'CAMPUS'
        ];
        cardType = cardType.toUpperCase();
        if (!validFields.includes(cardType)) {
            return {
                resType: 'BAD_REQUEST',
                resMsg: translate('paymentRoutes', 'Invalid card type'),
                isValid: false
            };
        }

        cardType = encryptPaymentData(cardType, 'PAYMENT');

        const cardFields = filterOptions ? filterFields(filterOptions) : null;

        log.info('Call db query to retrieve user cards for requested card type');
        let userCards = await dbConnect.getCardByType(userId, cardType, cardFields);
        if (userCards.length > 0) {
            log.info('Data format into readable format started');
            userCards.forEach(cardInfo => {
                cardInfo = formatResponse(cardInfo)
            });

            log.info('Execution for retrieving user card information retrieved successfully');
            return {
                resType: 'SUCCESS',
                resMsg: translate('paymentRoutes', 'User card information retrieved successfully'),
                data: userCards,
                isValid: true
            };
        }

        log.info('No user card information found');
        return {
            resType: 'CONTENT_NOT_AVAILABLE',
            resMsg: translate('paymentRoutes', 'No user card information found'),
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db for retrieveing card info for requested card type');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to retrieve user card info for requested card type'),
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getAllUserCards,
    getCardByToken,
    getCardByType
};
