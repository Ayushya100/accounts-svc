'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-finance-service';
import { decryptPaymentData, encryptPaymentData, generatePaymentToken, maskPaymentNumber, translate } from '../../utils/index.js';

const header = 'controller: register-card-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const checkCardByCardNumber = async(cardNumber) => {
    registerLog.createDebugLog('Start checking if card with provided card number is available');

    try {
        log.info('Execution for checking if card with provided card number started');
        let response = {
            resType: 'SUCCESS',
            resMsg: 'VALIDATION SUCCESSFULL',
            isValid: true
        };

        const encryptedCardNumber = encryptPaymentData(cardNumber, 'PAYMENT');
        log.info('Call db query to get the existing card information from the database');
        const isCardAvailable = await dbConnect.isCardByCardNumberAvailable(encryptedCardNumber);

        if (isCardAvailable) {
            response.resType = 'CONFLICT';
            response.resMsg = translate('paymentRoutes', 'Card already exists with same card number');
            response.isValid = false;
        }

        log.info('Execution for checking existing card for provided card number completed');
        return response;
    } catch (err) {
        log.error('Error while working with db to check for existing card with provided card number');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to check for existing card with provided card number'),
            stack: err.stack,
            isValid: false
        };
    }
}

const registerCard = async(userId, accountId, payload) => {
    registerLog.createDebugLog('Start registering new card in system started');

    try {
        log.info('Execution for registering new card started');
        log.info('Execution for building card data started');
        payload.token = generatePaymentToken(String(payload.cardNumber), 'PAYMENT');
        payload.accountId = accountId;

        const creditCardTypes = ['DEBIT', 'PROCUREMENT', 'HEALTH_SAVINGS'];
        payload.balance = creditCardTypes.includes(payload.cardType.toUpperCase()) ? 0 : Number(payload.balance);

        payload.cardType = encryptPaymentData(String(payload.cardType.toUpperCase()), 'PAYMENT');
        payload.cardNumber = encryptPaymentData(String(payload.cardNumber), 'PAYMENT');
        payload.expirationDate = encryptPaymentData(String(payload.expirationDate), 'PAYMENT');
        payload.holderName = encryptPaymentData(String(payload.holderName), 'PAYMENT');

        log.info('Call db query to register new card');
        const newCard = await dbConnect.registerCard(userId, payload);
        if (newCard) {
            const data = {
                token: newCard.token,
                cardNumber: maskPaymentNumber(decryptPaymentData(newCard.cardNumber, 'PAYMENT')),
                cardType: decryptPaymentData(newCard.cardType, 'PAYMENT'),
                expirationDate: decryptPaymentData(newCard.expirationDate, 'PAYMENT'),
                holderName: decryptPaymentData(newCard.holderName, 'PAYMENT')
            };

            log.info('Execution for registering new card in db completed successfully');
            return {
                resType: 'REQUEST_COMPLETED',
                resMsg: translate('paymentRoutes', 'Card created successfully'),
                data: data,
                isValid: true
            };
        }

        log.error('Error while registering new card in database');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to register new card'),
            stack: err.stack,
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to register new card');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: translate('paymentRoutes', 'Some error occurred while working with db to register new card'),
            stack: err.stack,
            isValid: false
        };
    }
}

const sendCardCreationMailPayload = (userData, payload) => {
    log.info('Execution for building payload for sending mail started');

    const mailPayload = {
        emailId: userData.emailId,
        emailType: 'CARD_REGISTRATION_MAIL',
        context: {
            fullName: userData.firstName + ' ' + userData.lastName,
            cardNumber: payload.cardNumber,
            cardType: payload.cardType,
            expirationDate: payload.expirationDate,
            holderName: payload.holderName
        }
    };

    log.info('Execution for building mail payload completed');
    return mailPayload;
}

export {
    checkCardByCardNumber,
    registerCard,
    sendCardCreationMailPayload
};
