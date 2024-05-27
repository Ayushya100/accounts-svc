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

const getUserVerificationDetails = async(userId) => {
    const query = {
        _id: userId
    };
    const fields = 'firstName lastName userName emailId verificationCode verificationCodeExpiry isVerified isDeleted';

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

    const additionalData = await getUserSetupInfo(userId, user.roleId);

    const accessToken = jwt.sign(
        {
            _id: user._id,
            userName: user.userName,
            userRole: additionalData.userRole.roleCode,
            userScopes: additionalData.userScopes,
            userSetup: additionalData.userSetup,
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
        userRole: additionalData.userRole.roleCode,
        userScopes: additionalData.userScopes,
        userSetup: additionalData.userSetup.map(setupDetail => ({
            categoryName: setupDetail.categoryName,
            categoryDescription: setupDetail.categoryDescription,
            value: setupDetail.value
        }))
    };
}

const getUserFullDetails = async(userId) => {
    const query = {
        _id: userId
    };
    const fields = '-verificationCode -verificationCodeExpiry -forgotPasswordToken -forgotPasswordTokenExpiry -refreshToken -password -createdOn -createdBy -modifiedOn -modifiedBy';

    const db = new userTemplate();
    return await db.findById(query, fields);
}

const getUserSetupInfo = async(userId, roleId) => {
    const allUserScopes = await dbConnect.getAllUserScope(roleId);
    const userScopes = allUserScopes.map(scopes => scopes.scope);

    let userRole = await dbConnect.getUserRoleById(roleId);
    userRole = userRole[0];

    const fieldsToRetrieve = [
        'user-language',
        'user-theme'
    ];
    const userSetup = await dbConnect.getUserDashboardSetup(userId, fieldsToRetrieve);

    return {
        userScopes, userRole, userSetup
    };
}

const updateUserInfo = async(userId, userPayload) => {
    const currentUserInfo = await isUserByIdAvailable(userId);

    const query = {
        _id: userId
    };
    const payload = {
        firstName: userPayload.firstName || currentUserInfo.firstName,
        lastName: userPayload.lastName || currentUserInfo.lastName,
        userName: userPayload.userName || currentUserInfo.userName,
        bio: userPayload.bio || currentUserInfo.bio,
        gender: userPayload.gender || currentUserInfo.gender,
        dob: userPayload.dob || currentUserInfo.dob,
        contactNumber: userPayload.contactNumber || currentUserInfo.contactNumber
    };
    const fields = '-verificationCode -verificationCodeExpiry -forgotPasswordToken -forgotPasswordTokenExpiry -refreshToken -password -createdBy -modifiedOn -modifiedBy';
    const db = new userTemplate();
    return await db.findByIdAndUpdate(userId, query, payload, fields);
}

const updateUserPassword = async(userId, payload) => {
    const db = new userTemplate();
    const fields = '-verificationCode -verificationCodeExpiry -forgotPasswordToken -forgotPasswordTokenExpiry -refreshToken -createdBy -modifiedOn -modifiedBy';

    const query = {
        _id: userId
    };
    const currentUserInfo = await db.findOne(query, fields);

    if (await verifyPassword(currentUserInfo, payload.oldPassword)) {
        currentUserInfo.password = payload.newPassword;
        currentUserInfo.modifiedOn = Date.now();
        currentUserInfo.modifiedBy = userId;
        await currentUserInfo.save({
            validateBeforeSave: false
        });

        return await isUserByIdAvailable(userId);
    }
    return false;
}

export {
    isUserByUsernameOrEmailAvailable,
    createNewUser,
    assignUserRole,
    isUserByIdAvailable,
    getUserVerificationDetails,
    validateUser,
    verifyPassword,
    generateVerificationCode,
    reactivateUser,
    generateAccessAndRefreshTokens,
    getUserFullDetails,
    getUserSetupInfo,
    updateUserInfo,
    updateUserPassword
};
