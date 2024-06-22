'use strict';

import mongoose from 'mongoose';

// Import DB Templates
import { userAccountTemplate, taskAccountTemplate } from 'lib-finance-service';

const accountDB = new userAccountTemplate();
const taskDB = new taskAccountTemplate();

const isAccountByAccNumberAvailable = async(encryptedAccountNumber) => {
    const query = {
        accountNumber: encryptedAccountNumber
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

export {
    isAccountByAccNumberAvailable,
    isAccountByTokenAvailable,
    createAccount,
    createTask
};
