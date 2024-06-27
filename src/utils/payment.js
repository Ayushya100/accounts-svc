'use strict';

import { logger } from 'lib-finance-service';
import crypto from 'crypto';

const header = 'util: format-payment-accounts';

const log = logger(header);

const maskPaymentNumber = (accountNumber) => {
    log.info(`Payment account number masking requested for ${accountNumber}`);
    const endVisibleValue = accountNumber.slice(-4);
    const startVisibleValue = accountNumber.substring(0, 2);
    let maskedDigits = accountNumber.length >= 12 ? '*'.repeat(accountNumber.length - 6) : '*'.repeat(accountNumber.length - 4);

    let visibleAccountNumber = accountNumber.length >= 12 ?
        `${startVisibleValue}${maskedDigits}${endVisibleValue}` :
        `${maskedDigits}${endVisibleValue}`;
    log.info('Payment account number masking completed');
    return visibleAccountNumber;
}

const maskUPINumber = (accountNumber) => {
    log.info(`UPI account number masking requested for ${accountNumber}`);
    const visibleValue = accountNumber.split('@');
    const endVisibleValue = visibleValue[0].slice(-2);
    const startVisibleValue = visibleValue[0].substring(0, 2);
    let maskedDigits = '*'.repeat(visibleValue[0].length - 4);
    visibleValue[0] = `${startVisibleValue}${maskedDigits}${endVisibleValue}`;

    log.info('UPI account number masking completed');
    return visibleValue.join('@');
}

const generateRandomNumberForToken = () => {
    const randomBytes = crypto.randomBytes(5);
    let randomNumber = '';
    for (let i = 0; i < 5; i++) {
        randomNumber += (randomBytes[i] % 10).toString();
    }
    return parseInt(randomNumber);
}

const generatePaymentToken = (accountName, type = 'PAYMENT', byteSize = 32) => {
    log.info(`Token generation started for : ${accountName}`);
    const method = type === 'ACCOUNT' ? process.env.ACCOUNT_TOKEN_METHOD : process.env.PAYMENT_TOKEN_METHOD;
    const hashedData = crypto.createHash(method).update(accountName).digest('hex');
    const randomBytes = crypto.randomBytes(byteSize).toString('hex');
    const token = `${hashedData}${randomBytes}`;

    log.info('Token generation completed');
    return token;
}

const encryptPaymentData = (data, type = 'PAYMENT') => {
    log.info('Data encryption started');
    const method = type === 'ACCOUNT' ? process.env.ACCOUNT_ENCRYPTION_METHOD : process.env.PAYMENT_ENCRYPTION_METHOD;
    const encryptionKey = type === 'ACCOUNT' ? process.env.ACCOUNT_ENCRYPTION_KEY : process.env.PAYMENT_ENCRYPTION_KEY;
    const iv = type === 'ACCOUNT' ? process.env.ACCOUNT_ENCRYPTION_INITIALIZATION : process.env.PAYMENT_ENCRYPTION_INITIALIZATION;

    const cipher = crypto.createCipheriv(method, Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'));
    let encryptedData = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    encryptedData = iv + ':' + encryptedData;

    log.info('Data encryption completed');
    return encryptedData;
}

const decryptPaymentData = (encryptedData, type = 'PAYMENT') => {
    log.info('Data decryption started');
    const method = type === 'ACCOUNT' ? process.env.ACCOUNT_ENCRYPTION_METHOD : process.env.PAYMENT_ENCRYPTION_METHOD;
    const encryptionKey = type === 'ACCOUNT' ? process.env.ACCOUNT_ENCRYPTION_KEY : process.env.PAYMENT_ENCRYPTION_KEY;

    const [iv, encryptedText] = encryptedData.split(':');
    const decipher = crypto.createDecipheriv(method, Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'));
    let decryptedData = decipher.update(encryptedText, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');

    log.info('Data decryption completed');
    return decryptedData;
}

const getConvertedDate = (date) => {
    date = new Date(date);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return {day, month, year};
}

const convertDateToString = (date) => {
    date = getConvertedDate(date);
    return `${date.year}-${date.month}`;
}

const convertFullDateToString = (date) => {
    date = getConvertedDate(date);
    return `${date.year}-${date.month}-${date.day}`;
}

export {
    maskPaymentNumber,
    generatePaymentToken,
    encryptPaymentData,
    decryptPaymentData,
    convertDateToString,
    convertFullDateToString,
    maskUPINumber,
    generateRandomNumberForToken
};
