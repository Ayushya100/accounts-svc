'use strict';

import registerAccount from './registerAccount.route.js';
import getAccountInfo from './getAccountInfo.route.js';
import updateAccountInfo from './updateAccountInfo.route.js';
import deactivateAccount from './deactivateAccount.route.js';
import reactivateAccount from './reactivateAccount.route.js';
import deleteAccountInfo from './deleteAccount.route.js';
import registerPaymentMethod from './registerPaymentOptions.route.js';
import getPaymentAccountInfo from './getPaymentAccountInfo.route.js';
import updatePaymentAccountInfo from './updatePaymentAccountInfo.route.js';
import deactivatePaymentAccount from './deactivatePaymentAccount.route.js';
import reactivatePaymentAccount from './reactivatePaymentAccount.route.js';

export default {
    registerAccount,
    getAccountInfo,
    updateAccountInfo,
    deactivateAccount,
    reactivateAccount,
    deleteAccountInfo,
    registerPaymentMethod,
    getPaymentAccountInfo,
    updatePaymentAccountInfo,
    deactivatePaymentAccount,
    reactivatePaymentAccount
};
