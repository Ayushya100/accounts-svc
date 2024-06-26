'use strict';

import mongoose from 'mongoose';

// Import DB Templates
import {
    userAccountTemplate,
    taskAccountTemplate,
    paymentMethodsTemplate,
    cardMethodsTemplate
} from 'lib-finance-service';

const accountDB = new userAccountTemplate();
const taskDB = new taskAccountTemplate();
const paymentDB = new paymentMethodsTemplate();
const cardDB = new cardMethodsTemplate();

const isAccountByAccNumberAvailable = async(encryptedAccountNumber) => {
    const query = {
        accountNumber: encryptedAccountNumber,
        isDeleted: false
    };
    return await accountDB.findOne(query, null);
}

const isAccountByTokenAvailable = async(userId, accountToken) => {
    const query = {
        userId: userId,
        token: accountToken
    };
    return await accountDB.findOne(query, null);
}

const createAccount = async(userId, payload) => {
    const accountPayload = {
        userId: userId,
        token: payload.token,
        accountName: payload.accountName,
        accountNumber: payload.accountNumber,
        accountType: payload.accountType,
        accountDate: payload.accountDate,
        holderName: payload.holderName
    };
    return await accountDB.create(accountPayload);
}

const createTask = async(payload) => {
    return await taskDB.create(payload);
}

const getAllUserAccount = async(userId, fields) => {
    const query = {
        userId: new mongoose.mongoose.Types.ObjectId(userId),
        isDeleted: false
    };
    return await accountDB.find(query, fields);
}

const getUserAccountByToken = async(userId, accountToken, fields) => {
    const query = {
        userId: new mongoose.mongoose.Types.ObjectId(userId),
        token: accountToken,
        isDeleted: false
    };
    return await accountDB.findOne(query, fields);
}

const updateAccountByToken = async(userId, accountToken, payload) => {
    const query = {
        userId: new mongoose.mongoose.Types.ObjectId(userId),
        token: accountToken,
        isDeleted: false
    };
    return await accountDB.findOneAndUpdate(userId, query, payload, null);
}

const deactivateReactivateAccountByToken = async(userId, accountToken, isActive) => {
    const query = {
        userId: new mongoose.mongoose.Types.ObjectId(userId),
        token: accountToken,
        isDeleted: false
    };
    const payload = {
        isActive: isActive
    };
    const fields = 'userId token isActive isDeleted';
    return await accountDB.findOneAndUpdate(userId, query, payload, fields);
}

const deleteAccountByToken = async(userId, accountToken) => {
    const query = {
        userId: new mongoose.mongoose.Types.ObjectId(userId),
        token: accountToken,
        isDeleted: false
    };
    const payload = {
        isActive: false,
        isDeleted: true
    };
    const fields = 'userId token isActive isDeleted';
    return await accountDB.findOneAndUpdate(userId, query, payload, fields);
}

const isPaymentOptionAvailable = async(query) => {
    return await paymentDB.findOne(query, null);
}

const createPaymentAccount = async(payload) => {
    return await paymentDB.create(payload);
}

const getAllUserPaymentAccount = async(userId, fields) => {
    const query = {
        userId: new mongoose.mongoose.Types.ObjectId(userId),
        isDeleted: false
    };
    return await paymentDB.find(query, fields);
}

const getPaymentAccountByToken = async(userId, accountToken, fields) => {
    const query = {
        userId: new mongoose.mongoose.Types.ObjectId(userId),
        token: accountToken,
        isDeleted: false
    };
    return await paymentDB.findOne(query, fields);
}

const getPaymentAccountByType = async(userId, accountType, fields) => {
    const query = {
        userId: new mongoose.mongoose.Types.ObjectId(userId),
        paymentType: accountType,
        isDeleted: false
    };
    return await paymentDB.find(query, fields);
}

const updatePaymentAccountByToken = async(userId, accountToken, payload) => {
    const query = {
        userId: new mongoose.mongoose.Types.ObjectId(userId),
        token: accountToken,
        isDeleted: false
    };
    return await paymentDB.findOneAndUpdate(userId, query, payload, null);
}

const deactivateReactivatePaymentAccountByToken = async(userId, accountToken, isActive) => {
    const query = {
        userId: new mongoose.mongoose.Types.ObjectId(userId),
        token: accountToken,
        isDeleted: false
    };
    const payload = {
        isActive: isActive
    };
    const fields = 'userId token isActive isDeleted';
    return await paymentDB.findOneAndUpdate(userId, query, payload, fields);
}

const deletePaymentAccountByToken = async(userId, accountToken) => {
    const query = {
        userId: new mongoose.mongoose.Types.ObjectId(userId),
        token: accountToken,
        isDeleted: false
    };
    const payload = {
        isActive: false,
        isDeleted: true
    };
    const fields = 'userId token isActive isDeleted';
    return await paymentDB.findOneAndUpdate(userId, query, payload, fields);
}

const isCardByCardNumberAvailable = async(encryptedCardNumber) => {
    const query = {
        cardNumber: encryptedCardNumber,
        isDeleted: false
    };
    return await cardDB.findOne(query, null);
}

const registerCard = async(userId, payload) => {
    const cardPayload = {
        userId: userId,
        accountId: payload.accountId,
        token: payload.token,
        cardNumber: payload.cardNumber,
        cardType: payload.cardType,
        expirationDate: payload.expirationDate,
        holderName: payload.holderName,
        balance: payload.balance
    };
    return await cardDB.create(cardPayload);
}

const getAllUserCards = async(userId, fields) => {
    const query = {
        userId: new mongoose.mongoose.Types.ObjectId(userId),
        isDeleted: false
    };
    return await cardDB.find(query, fields);
}

const getCardByToken = async(userId, cardToken, fields) => {
    const query = {
        userId: new mongoose.mongoose.Types.ObjectId(userId),
        token: cardToken,
        isDeleted: false
    };
    return await cardDB.findOne(query, fields);
}

const getCardByType = async(userId, cardType, fields) => {
    const query = {
        userId: new mongoose.mongoose.Types.ObjectId(userId),
        cardType: cardType,
        isDeleted: false
    };
    return await cardDB.find(query, fields);
}

export {
    isAccountByAccNumberAvailable,
    isAccountByTokenAvailable,
    createAccount,
    createTask,
    getAllUserAccount,
    getUserAccountByToken,
    updateAccountByToken,
    deactivateReactivateAccountByToken,
    deleteAccountByToken,
    isPaymentOptionAvailable,
    createPaymentAccount,
    getAllUserPaymentAccount,
    getPaymentAccountByToken,
    getPaymentAccountByType,
    updatePaymentAccountByToken,
    deactivateReactivatePaymentAccountByToken,
    deletePaymentAccountByToken,
    isCardByCardNumberAvailable,
    registerCard,
    getAllUserCards,
    getCardByToken,
    getCardByType
};
