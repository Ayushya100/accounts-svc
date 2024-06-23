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
        userId: userId,
        token: accountToken,
        isDeleted: false
    };
    return await accountDB.findOneAndUpdate(userId, query, payload, null);
}

const deactivateReactivateAccountByToken = async(userId, accountToken, isActive) => {
    const query = {
        userId: userId,
        token: accountToken,
        isDeleted: false
    };
    const payload = {
        isActive: isActive
    };
    const fields = 'userId token isActive isDeleted';
    return await accountDB.findOneAndUpdate(userId, query, payload, fields);
}

export {
    isAccountByAccNumberAvailable,
    isAccountByTokenAvailable,
    createAccount,
    createTask,
    getAllUserAccount,
    getUserAccountByToken,
    updateAccountByToken,
    deactivateReactivateAccountByToken
};
