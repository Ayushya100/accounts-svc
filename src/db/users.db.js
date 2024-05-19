'use strict';

// Import DB Templates
import { financeTemplate, userTemplate } from 'lib-finance-service';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import dbConnect from './index.js';

const isUserByUsernameOrEmailAvailable = async(userName, emailId) => {
    const query = {
        $or: [{ userName }, { emailId }]
    };
    const fields = 'roleId firstName lastName userName emailId password lastLogin loginCount isVerified isDeleted';

    const db = new userTemplate();
    return await db.findOne(query, fields);
}

const isUserByIdAvailable = async(userId) => {
    const query = {
        _id: userId
    };
    const db = new userTemplate();
    return await db.findById(query, null);
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

    const fields = 'roleId firstName lastName userName emailId verificationCode isVerified';
    return await db.findByIdAndUpdate(userId, query, payload, fields);
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

const getUserFullDetails = async(userId) => {
    const query = {
        _id: userId
    };
    const fields = 'roleId firstName lastName userName emailId profileImageURL lastLogin loginCount verificationCode verificationCodeExpiry isVerified isVerified';

    const db = new userTemplate();
    return await db.findById(query, fields);
}

const validateUser = async(userId) => {
    const query = {
        _id: userId
    };
    const payload = {
        verificationCode: '',
        isVerified: true
    };
    const db = new userTemplate();
    return await db.findByIdAndUpdate(userId, query, payload, null);
}

const verifyPassword = async(user, password) => {
    const isPasswordValid = await user.isPasswordCorrect(password);
    return isPasswordValid;
}

const reactivateUser = async(userId) => {
    const query = {
        _id: userId
    };
    const payload = {
        isDeleted: false
    };
    const db = new userTemplate();
    return await db.findByIdAndUpdate(userId, query, payload, null);
}

const generateAccessAndRefreshTokens = async(userId) => {
    const db = new userTemplate();
    const user = await db.findById({ _id: userId }, null);

    const allUserScopes = await dbConnect.getAllUserScope(user.roleId);
    const userScopes = allUserScopes.map(scopes => scopes.scope);

    let userRole = await dbConnect.getUserRoleById(user.roleId);
    userRole = userRole[0];

    const fieldsToRetrieve = [
        'user-language',
        'user-theme'
    ];
    const userSetup = await dbConnect.getUserDashboardSetup(userId, fieldsToRetrieve);

    const accessToken = jwt.sign(
        {
            _id: user._id,
            userName: user.userName,
            userRole: userRole.roleCode,
            userScopes: userScopes,
            userSetup: userSetup,
            isVerified: user.isVerified,
            isDeleted: user.isDeleted
        },
        process.env.ACCESS_TOKEN_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );

    const refreshToken = jwt.sign(
        {
            _id: user._id
        },
        process.env.REFRESH_TOKEN_KEY,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );

    const query = {
        _id: user._id
    };
    const payload = {
        refreshToken: refreshToken,
        loginCount: user.loginCount + 1,
        lastLogin: Date.now()
    };
    const fields = '-password -createdOn -createdBy -modifiedOn -modifiedBy';
    const updatedUserInfo = await db.findByIdAndUpdate(user._id, query, payload, fields);

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        userId: updatedUserInfo._id,
        userName: updatedUserInfo.userName,
        userRole: userRole.roleCode,
        userScopes: userScopes,
        userSetup: userSetup.map(setupDetail => ({
            categoryName: setupDetail.categoryName,
            categoryDescription: setupDetail.categoryDescription,
            value: setupDetail.value
        }))
    };
}

export {
    isUserByUsernameOrEmailAvailable,
    createNewUser,
    assignUserRole,
    isUserByIdAvailable,
    getUserFullDetails,
    validateUser,
    verifyPassword,
    generateVerificationCode,
    reactivateUser,
    generateAccessAndRefreshTokens
};
