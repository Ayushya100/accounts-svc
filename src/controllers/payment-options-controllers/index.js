'use strict';

import {
    validateRegisterAccountPayload,
    validateUpdateAccountPayload,
    validateRegisterPaymentPayload,
    validateUpdatePaymentPayload,
    validateRegisterCardPayload
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
import {
    getAllPaymentAccount,
    getPaymentAccountByToken,
    getPaymentAccountByPaymentType
} from './getPaymentAccountInfo.controller.js';
import { updatePaymentAccountInfo } from './updatePaymentAccountInfo.controller.js';
import { deactivatePaymentAccount, reactivatePaymentAccount } from './deactivateReactivatePaymentAccount.controller.js';
import { deletePaymentAccountInfo } from './deletePaymentAccountInfo.controller.js';
import {
    checkCardByCardNumber,
    registerCard,
    sendCardCreationMailPayload
} from './registerCard.controller.js';

export default {
    validateRegisterAccountPayload,
    validateUpdateAccountPayload,
    validateRegisterPaymentPayload,
    validateUpdatePaymentPayload,
    validateRegisterCardPayload,
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
    registerPaymentOptionAccount,
    getAllPaymentAccount,
    getPaymentAccountByToken,
    getPaymentAccountByPaymentType,
    updatePaymentAccountInfo,
    deactivatePaymentAccount,
    reactivatePaymentAccount,
    deletePaymentAccountInfo,
    checkCardByCardNumber,
    registerCard,
    sendCardCreationMailPayload
};
