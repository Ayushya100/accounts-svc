'use strict';

import { logger } from 'lib-finance-service';
import validators from '../../assets/validators/payloadValidators.js';
import { translate } from '../../utils/index.js';

const log = logger('controller: validate-payload');

const returnValidateStarted = (type) => {
    log.info(`Payload verification execution started for ${type}`);
}

const returnValidationConfirmation = () => {
    log.info('Payload verification completed');
}

const validateAccountDate = (accountDate) => {
    return new Date(accountDate) <= new Date();
}

const validateTaskStartDate = (startDate) => {
    return new Date(startDate) > new Date();
}

const validateTaskEndDate = (startDate, endDate) => {
    return new Date(startDate) >= new Date(endDate);
}

const validateDurationType = (duration) => {
    const availableTaskTypes = ['daily', 'monthly', 'quaterly', 'six-monthly', 'yearly'];
    return availableTaskTypes.includes(duration);
}

const validateAccountType = (accountType) => {
    const availableAccountType = [
        'SAVINGS',
        'CURRENT',
        'SALARY',
        'RECURRING',
        'FIXED_DEPOSIT',
        'NRI',
        'DEMAT',
        'EPF',
        'PPF',
        'NPS',
        'MUTUAL_FUNDS',
        'GOLD_SAVINGS',
        'GOVT_BONDS'
    ];
    accountType = accountType.toUpperCase();
    return availableAccountType.includes(accountType);
}

const validateAccountNumber = (accountNumber) => {
    return validators.accountNumber.test(accountNumber);
}

const validateTaskPayload = (payload) => {
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true,
        data: payload
    };

    const mandatoryFields = [
        'debitFrom', 'taskType', 'duration', 'durationCount', 'startDate', 'nextDepositDate'
    ];

    for (const field of mandatoryFields) {
        if (!payload[field]) {
            response.resType = 'BAD_REQUEST';
            response.resMsg = `${translate('paymentRoutes', 'Required Parameter is missing')}: ${translate('paymentRoutes', field)}`;
            response.isValid = false;
            break;
        }
    }

    if (payload.startDate && !validateTaskStartDate(payload.startDate)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `${translate('paymentRoutes', 'Start date cannot be past date')}`;
        response.isValid = false;
    }

    if (payload.nextDepositDate && !validateTaskStartDate(payload.nextDepositDate)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `${translate('paymentRoutes', 'Next Deposit date cannot be past date')}`;
        response.isValid = false;
    }

    if (payload.interestApplicable === null || payload.interestApplicable === undefined) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `${translate('paymentRoutes', 'Required Parameter is missing')}: ${translate('paymentRoutes', 'interestApplicable')}`;
        response.isValid = false;
    }

    if (payload.taskType && payload.taskType !== 'SIP') {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `${translate('paymentRoutes', 'Provided Task Type is not valid to be registered')}`;
        response.isValid = false;
    }
    
    if (payload.duration && !validateDurationType(payload.duration)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `${translate('paymentRoutes', 'Provided Duration is not valid to be registered')}`;
        response.isValid = false;
    }

    if (payload.interestApplicable && !payload.interestRate) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `${translate('paymentRoutes', 'Interest Rate is required')}`;
        response.isValid = false;
    }

    if (payload.endDate && !validateTaskEndDate(payload.startDate, payload.endDate)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `${translate('paymentRoutes', 'End date cannot be past date or smaller than the start date')}`;
        response.isValid = false;
    }

    if (payload.endDate && !payload.afterEndDepositTo) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `${translate('paymentRoutes', 'After Task completion deposit Bank info is required')}`;
        response.isValid = false;
    }

    return response;
}

// Mandatory parameters check for register account
const validateRegisterAccountPayload = (payload) => {
    returnValidateStarted('Register Account');
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true,
        data: payload
    };

    let preValidationSuccessfull = true;
    const mandatoryFields = ['accountName', 'accountNumber', 'accountType', 'accountDate', 'holderName'];

    if (!payload.accountName || !payload.accountNumber || !payload.accountType || !payload.accountDate || !payload.holderName) {
        preValidationSuccessfull = false;
        response.resType = 'BAD_REQUEST';
        response.resMsg = `${translate('paymentRoutes', 'Required Parameter is missing')}`;
        response.isValid = false;

        for (const field of mandatoryFields) {
            if (!payload[field]) {
                response.resMsg += `: ${translate('paymentRoutes', field)}`;
                break;
            }
        }
    }

    if (payload.accountDate && !validateAccountDate(payload.accountDate)) {
        preValidationSuccessfull = false;
        response.resType = 'BAD_REQUEST';
        response.resMsg = `${translate('paymentRoutes', 'Account Date cannot be future date')}`;
        response.isValid = false;
    }

    if (payload.accountType && !validateAccountType(payload.accountType)) {
        preValidationSuccessfull = false;
        response.resType = 'BAD_REQUEST';
        response.resMsg = `${translate('paymentRoutes', 'Provided Account Type is not valid to be registered')}`;
        response.isValid = false;
    }

    if (payload.accountNumber && !validateAccountNumber(payload.accountNumber)) {
        preValidationSuccessfull = false;
        response.resType = 'BAD_REQUEST';
        response.resMsg = `${translate('paymentRoutes', 'Provided Account Number does not follow the required pattern (number should be 11-16 digits long)')}`;
        response.isValid = false;
    }

    if (payload.task) {
        const taskResult = validateTaskPayload(payload.task);
        if (!taskResult.isValid) {
            preValidationSuccessfull = false;
            response.resType = taskResult.resType;
            response.resMsg = taskResult.resMsg;
            response.isValid = false;
        }
    }

    if (preValidationSuccessfull && payload.accountType === 'RECURRING' && !payload.task) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `${translate('paymentRoutes', 'Task is required for recurring account')}`;
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

export {
    validateRegisterAccountPayload
};
