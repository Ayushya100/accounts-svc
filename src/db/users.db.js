'use strict';

// Import DB Templates
import { financeTemplate, userTemplate } from 'lib-finance-service';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import dbConnect from './index.js';

const userDB = new userTemplate();
const financeDB = new financeTemplate();

const isUserByUsernameOrEmailAvailable = async(userName, emailId) => {
    const query = {
        $or: [{ userName }, { emailId }]
    };
    const fields = 'roleId firstName lastName userName emailId password lastLogin loginCount isVerified isDeleted';
    return await userDB.findOne(query, fields);
}

const isUserByIdAvailable = async(userId) => {
    const query = {
        _id: userId
    };
    return await userDB.findById(query, null);
}

const createNewUser = async(payload) => {
    const userPayload = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        userName: payload.userName,
        emailId: payload.emailId,
        password: payload.password
    };
    const newUser = await userDB.create(userPayload);
    await financeDB.create({ userId: newUser._id });

    const udpatedUser = await generateVerificationCode(newUser._id);
    return udpatedUser;
}

const generateVerificationCode = async(userId) => {
    const query = {
        _id: userId
    };
    const user = await userDB.findById(query, null);

    const verificationCode = uuidv4() + user._id;
    const payload = {
        verificationCode: verificationCode,
        verificationCodeExpiry: Date.now() + (6 * 60 * 60 * 1000)
    };

    const fields = 'roleId firstName lastName userName emailId verificationCode isVerified';
    return await userDB.findByIdAndUpdate(userId, query, payload, fields);
}

const assignUserRole = async(userId, roleId) => {
    const query = {
        _id: userId
    };
    const payload = {
        roleId: roleId
    };
    const fields = 'roleId firstName lastName isVerified isDeleted'
    return await userDB.findByIdAndUpdate(userId, query, payload, fields);
}

const getUserVerificationDetails = async(userId) => {
    const query = {
        _id: userId
    };
    const fields = 'firstName lastName userName emailId verificationCode verificationCodeExpiry isVerified isDeleted';
    return await userDB.findById(query, fields);
}

const validateUser = async(userId) => {
    const query = {
        _id: userId
    };
    const payload = {
        verificationCode: '',
        isVerified: true
    };
    return await userDB.findByIdAndUpdate(userId, query, payload, null);
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
    return await userDB.findByIdAndUpdate(userId, query, payload, null);
}

const generateTokens = async(userId) => {
    const user = await userDB.findById({ _id: userId }, null);
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

    return {
        user, additionalData, accessToken, refreshToken
    };
}

const generateAccessAndRefreshTokens = async(userId) => {
    const { user, additionalData, accessToken, refreshToken } = await generateTokens(userId);

    const query = {
        _id: user._id
    };
    const payload = {
        refreshToken: refreshToken,
        loginCount: user.loginCount + 1,
        lastLogin: Date.now()
    };
    const fields = '-password -createdOn -createdBy -modifiedOn -modifiedBy';
    const updatedUserInfo = await userDB.findByIdAndUpdate(user._id, query, payload, fields);

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

const refreshTokens = async(userId) => {
    const { user, additionalData, accessToken, refreshToken } = await generateTokens(userId);

    const query = {
        _id: user._id
    };
    const payload = {
        refreshToken: refreshToken,
        lastLogin: Date.now()
    };
    const fields = '-password -createdOn -createdBy -modifiedOn -modifiedBy';
    const updatedUserInfo = await userDB.findByIdAndUpdate(user._id, query, payload, fields);

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        userId: updatedUserInfo._id,
        userName: updatedUserInfo.userName
    };
}

const getUserFullDetails = async(userId) => {
    const query = {
        _id: userId
    };
    const fields = '-verificationCode -verificationCodeExpiry -forgotPasswordToken -forgotPasswordTokenExpiry -refreshToken -createdOn -createdBy -modifiedOn -modifiedBy';
    return await userDB.findById(query, fields);
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
        lastName: userPayload.lastName !== null || userPayload.lastName !== undefined ? userPayload.lastName : currentUserInfo.lastName,
        userName: userPayload.userName || currentUserInfo.userName,
        bio: userPayload.bio !== null || userPayload.bio !== undefined ? userPayload.bio : currentUserInfo.bio,
        gender: userPayload.gender !== null || userPayload.gender !== undefined ? userPayload.gender : currentUserInfo.gender,
        dob: userPayload.dob !== null || userPayload.dob !== undefined ? userPayload.dob : currentUserInfo.dob,
        contactNumber: userPayload.contactNumber !== null || userPayload.contactNumber !== undefined ? userPayload.contactNumber : currentUserInfo.contactNumber
    };
    const fields = '-verificationCode -verificationCodeExpiry -forgotPasswordToken -forgotPasswordTokenExpiry -refreshToken -password -createdBy -modifiedOn -modifiedBy';
    return await userDB.findByIdAndUpdate(userId, query, payload, fields);
}

const updateUserPassword = async(userId, payload) => {
    const fields = '-verificationCode -verificationCodeExpiry -forgotPasswordToken -forgotPasswordTokenExpiry -refreshToken -createdBy -modifiedOn -modifiedBy';
    const query = {
        _id: userId
    };
    const currentUserInfo = await userDB.findOne(query, fields);

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

const updateProfileImage = async(userId, cloudinaryImageURL) => {
    const query = {
        _id: userId
    };
    const payload = {
        profileImageURL: cloudinaryImageURL
    };
    return userDB.findByIdAndUpdate(userId, query, payload, null);
}

const userDeactivate = async(userId) => {
    const query = {
        _id: userId
    };
    const payload = {
        isDeleted: true
    };
    const fields = '-verificationCode -verificationCodeExpiry -forgotPasswordToken -forgotPasswordTokenExpiry -refreshToken -createdBy -modifiedBy';
    return await userDB.findByIdAndUpdate(userId, query, payload, fields);
}

const logoutUser = async(userId) => {
    const query = {
        _id: userId
    };
    const payload = {
        refreshToken: null
    };
    return await userDB.findByIdAndUpdate(userId, query, payload, null);
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
    updateUserPassword,
    updateProfileImage,
    userDeactivate,
    refreshTokens,
    logoutUser
};
