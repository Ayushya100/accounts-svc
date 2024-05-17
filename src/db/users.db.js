'use strict';

// Import DB Templates
import { financeTemplate, userTemplate } from 'lib-finance-service';
import { v4 as uuidv4 } from 'uuid';

const isUserByUsernameOrEmailAvailable = async(userName, emailId) => {
    const query = {
        $or: [{ userName }, { emailId }]
    };
    const db = new userTemplate();
    return await db.findOne(query, null);
}

const createNewUser = async(payload) => {
    const userPayload = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        userName: payload.userName,
        emailId: payload.emailId,
        password: payload.password
    };
    const db = new userTemplate();
    const newUser = await db.create(userPayload);

    const fdb = new financeTemplate();
    await fdb.create({ userId: newUser._id });

    const udpatedUser = await generateVerificationCode(newUser._id);
    return udpatedUser;
}

const generateVerificationCode = async(userId) => {
    const db = new userTemplate();
    const query = {
        _id: userId
    };
    const user = await db.findById(query, null);

    const verificationCode = uuidv4() + user._id;
    const payload = {
        verificationCode: verificationCode,
        verificationCodeExpiry: Date.now() + (6 * 60 * 60 * 1000)
    };
    return await db.findByIdAndUpdate(userId, query, payload, null);
}

const assignUserRole = async(userId, roleId) => {
    const query = {
        _id: userId
    };
    const payload = {
        roleId: roleId
    };
    const fields = 'roleId firstName lastName isVerified isDeleted'

    const db = new userTemplate();
    return await db.findByIdAndUpdate(userId, query, payload, fields);
}

export {
    isUserByUsernameOrEmailAvailable,
    createNewUser,
    assignUserRole
};
