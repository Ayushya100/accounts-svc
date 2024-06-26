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

const validUserName = (userName) => {
    return validators.userName.test(userName);
}

const validEmailId = (emailId) => {
    return validators.email.test(emailId);
}

const validPassword = (password) => {
    return validators.password.test(password);
}

const validContactNumber = (number) => {
    return validators.contactNumber.test(number);
}

// Mandatory parameters check for registering new user
const validateRegisterUserPayload = (payload) => {
    returnValidateStarted('Register User');
    let response = {
        resType: 'SUCCESS',
        resMsg: translate('userRoutes', 'VALIDATION SUCCESSFULL'),
        isValid: true,
        data: payload
    };

    const mandatoryFilds = ['firstName', 'userName', 'emailId', 'password'];

    if (!payload.firstName || !payload.userName || !payload.emailId || !payload.password) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = translate('userRoutes', 'Required Parameter is missing');
        response.isValid = false;

        for (const field of mandatoryFilds) {
            if (!payload[field]) {
                response.resMsg += `: ${translate('userRoutes', field)}`;
                break;
            }
        }
    }

    if (payload.userName && !validUserName(payload.userName)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = translate('userRoutes', 'Pattern invalid Provided username doesnot match the required pattern UserName should be only alpha-numeric of length 4-24 characters long without any special characters');
        response.isValid = false;
    }
    
    if (payload.emailId && !validEmailId(payload.emailId)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = translate('userRoutes', 'Pattern invalid Provided Email ID doesnot match the required pattern');
        response.isValid = false;
    }

    if (payload.password && !validPassword(payload.password)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = translate('userRoutes', 'Pattern invalid Provided Password doesnot match the required pattern Password should be between 8 and 16 characters long It can be alpha-numeric and only @ is allowed');
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

// Mandatory parameters check for verifying new user
const validateUserVerificationPayload = (verificationCode) => {
    returnValidateStarted('Validate User Verification');
    let response = {
        resType: 'SUCCESS',
        resMsg: translate('userRoutes', 'VALIDATION SUCCESSFULL'),
        isValid: true
    };

    if (!verificationCode) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = translate('userRoutes', 'Required Parameter is missing');
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

// Mandatory parameters check for registering new user
const validateUserLoginPayload = (payload) => {
    returnValidateStarted('Validate User Login');
    let response = {
        resType: 'SUCCESS',
        resMsg: translate('userRoutes', 'VALIDATION SUCCESSFULL'),
        isValid: true
    };

    if (!payload.userNameOrEmail) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = translate('userRoutes', 'Required parameter is missing: UserName of EmailId should be provided');
        response.isValid = false;
    }
    
    if (!payload.password) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = translate('userRoutes', 'Required parameter is missing: password');
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

// Mandatory parameter check for updating user details
const validateUserDetailsPayload = (payload) => {
    returnValidateStarted('Validate User Details');
    let response = {
        resType: 'SUCCESS',
        resMsg: translate('userRoutes', 'VALIDATION SUCCESSFULL'),
        isValid: true
    };

    if (payload.contactNumber && !validContactNumber(payload.contactNumber)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = translate('userRoutes', 'Pattern invalid Contact Number incorrect');
        response.isValid = false;
    }
    
    if (payload.userName !== '' && payload.userName !== undefined && !validUserName(payload.userName)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = translate('userRoutes', 'Pattern invalid Username incorrect');
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

// Mandatory parameters check for updating user password
const validatePasswordUpdatePayload = (payload) => {
    returnValidateStarted('Validate Password Update');
    let response = {
        resType: 'SUCCESS',
        resMsg: translate('userRoutes', 'VALIDATION SUCCESSFULL'),
        isValid: true
    };

    if (!payload.oldPassword || !payload.newPassword) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = translate('userRoutes', 'Required Parameters are missing');
        response.isValid = false;
    }

    if (!validPassword(payload.newPassword)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = translate('userRoutes', 'Pattern invalid New Password incorrect');
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

// Mandatory parameter check for updating profile image
const validateProfileImagePayload = (profileImagePath) => {
    returnValidateStarted('Validate Profile Image');
    let response = {
        resType: 'SUCCESS',
        resMsg: translate('userRoutes', 'VALIDATION SUCCESSFULL'),
        isValid: true
    };
    
    if (!profileImagePath) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = translate('userRoutes', 'Profile image is missing');
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

// Mandatory parameters check for deactivate user
const validateDeactivateUserPayload = (payload) => {
    returnValidateStarted('Validate Deactivate User');
    let response = {
        resType: 'SUCCESS',
        resMsg: translate('userRoutes', 'VALIDATION SUCCESSFULL'),
        isValid: true
    };

    if (!payload.userName || !payload.password) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = translate('userRoutes', 'Required Parameters are missing');
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

export {
    validateRegisterUserPayload,
    validateUserVerificationPayload,
    validateUserLoginPayload,
    validateUserDetailsPayload,
    validatePasswordUpdatePayload,
    validateProfileImagePayload,
    validateDeactivateUserPayload
};
