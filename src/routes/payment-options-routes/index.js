'use strict';

import registerAccount from './registerAccount.route.js';
import getAccountInfo from './getAccountInfo.route.js';
import updateAccountInfo from './updateAccountInfo.route.js';
import deactivateAccount from './deactivateAccount.route.js';
import reactivateAccount from './reactivateAccount.route.js';
import deleteAccountInfo from './deleteAccount.route.js';
import registerPaymentMethod from './registerPaymentOptions.route.js';

export default {
    registerAccount,
    getAccountInfo,
    updateAccountInfo,
    deactivateAccount,
    reactivateAccount,
    deleteAccountInfo,
    registerPaymentMethod
};
