'use strict';

import registerUser from './registerUser.route.js';
import verifyUser from './verifyUser.route.js';
import loginUser from './loginUser.route.js';
import getUserInfo from './getUserInfo.route.js';
import updateUserDetails from './updateUserDetails.route.js';
import updateUserPassword from './updateUserPassword.route.js';
import updateProfileImage from './updateProfileImage.route.js';
import deleteProfileImage from './deleteProfileImage.route.js';
import deactivateUser from './deactivateUser.route.js';
import refreshAccessToken from './refreshAccessToken.route.js';

export default {
    registerUser,
    verifyUser,
    loginUser,
    getUserInfo,
    updateUserDetails,
    updateUserPassword,
    updateProfileImage,
    deleteProfileImage,
    deactivateUser,
    refreshAccessToken
};
