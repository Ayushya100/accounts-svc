'use strict';

import {
    validateRegisterAccountPayload,
    validateUpdateAccountPayload,
    validateRegisterPaymentPayload
} from './validatePayload.controller.js';
import {
    checkAccountByAccNumber,
    registerAccount,
    createTask,
    sendAccountCreationMailPayload
} from './registerAccount.controller.js';
import { checkAccountByToken } from './shared.controller.js';
import { getAllUserAccount, getUserAccountByToken } from './getAccountInfo.controller.js';
import { updateAccountInfo } from './updateAccountInfo.controller.js';
import { deactivateAccount, reactivateAccount } from './deactivateReactivateAccount.controller.js';
import { deleteAccountInfo } from './deleteAccountInfo.controller.js';
import { checkPaymentOptionAccount, registerPaymentOptionAccount } from './registerPaymentOptions.controller.js';

export default {
    validateRegisterAccountPayload,
    validateUpdateAccountPayload,
    validateRegisterPaymentPayload,
    checkAccountByAccNumber,
    registerAccount,
    createTask,
    checkAccountByToken,
    sendAccountCreationMailPayload,
    getAllUserAccount,
    getUserAccountByToken,
    updateAccountInfo,
    deactivateAccount,
    reactivateAccount,
    deleteAccountInfo,
    checkPaymentOptionAccount,
    registerPaymentOptionAccount
};
