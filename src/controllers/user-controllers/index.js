'use strict';

import {
    validateRegisterUserPayload,
    validateUserVerificationPayload,
    validateUserLoginPayload,
    validateUserDetailsPayload,
    validatePasswordUpdatePayload,
    validateProfileImagePayload,
    validateDeactivateUserPayload
} from './validatePayload.controller.js';
import {
    checkUserByUserNameOrEmail,
    createNewUser,
    sendVerificationMailPayload
} from './registerUser.controller.js';
import { checkUserById } from './shared.controller.js';
import { verifyUser, sendVerificationSuccessfulMailPayload } from './verifyUser.controller.js';
import {
    isUserValid,
    isUserVerified,
    isUserActive,
    generateAccessAndRefreshTokens,
    sendAccountReactivationMailPayload
} from './loginUser.controller.js';
import { getUserDtlInfo } from './getUserDtlInfoById.controller.js';
import { updateUserDetails, sendUpdateDetailsMailPayload } from './updateUserDetails.controller.js';
import { updateUserPassword, sendUpdatePasswordMailPayload } from './updateUserPassword.controller.js';
import { updateProfileImage, deleteProfileImage } from './profileImage.controller.js';
import {
    validateUserCredentials,
    deactivateUser,
    sendAccountDeactivateMailPayload
} from './deactivateUser.controller.js';
import { isTokenAvailableAndActive, refreshTokens } from './refreshAccessToken.controller.js';

export default {
    validateRegisterUserPayload,
    validateUserVerificationPayload,
    validateUserLoginPayload,
    validateUserDetailsPayload,
    validatePasswordUpdatePayload,
    validateProfileImagePayload,
    validateDeactivateUserPayload,
    checkUserByUserNameOrEmail,
    createNewUser,
    sendVerificationMailPayload,
    checkUserById,
    verifyUser,
    sendVerificationSuccessfulMailPayload,
    isUserValid,
    isUserVerified,
    isUserActive,
    generateAccessAndRefreshTokens,
    sendAccountReactivationMailPayload,
    getUserDtlInfo,
    updateUserDetails,
    sendUpdateDetailsMailPayload,
    updateUserPassword,
    sendUpdatePasswordMailPayload,
    updateProfileImage,
    deleteProfileImage,
    validateUserCredentials,
    deactivateUser,
    sendAccountDeactivateMailPayload,
    isTokenAvailableAndActive,
    refreshTokens
};
