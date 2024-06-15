'use strict';

import { logger } from 'lib-finance-service';

const log = logger('controller: validate-payload');

const returnValidationConfirmation = () => {
    log.info('Requested Payload validation completed successfully');
}

const isValidMethod = (method) => {
    return ['GET', 'POST', 'PUT', 'DELETE'].includes(method);
}

const validateCreateSettingPayload = (payload) => {
    log.info('Payload verification execution started');
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };

    const mandatoryFields = ['categoryName', 'categoryDescription', 'categoryType', 'subCategory'];

    if (!payload.categoryName || !payload.categoryDescription || !payload.categoryType || !payload.subCategory || payload.isPeriodic === '') {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `Required parameter is missing`;
        response.isValid = false;

        for(const field of mandatoryFields) {
            if (!payload[field]) {
                response.resMsg += `: ${field}`;
                break;
            }
        }
    }

    if (payload.defaultValue === null || payload.defaultValue === undefined) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `Required parameter is missing: defaultValue`;
        response.isValid = false;
    }

    if (payload.isPeriodic && !payload.duration) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `Required parameter cannot be empty - duration missing`;
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

const validateNewRoutePayload = (payload) => {
    log.info('Payload verification execution started');
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };

    const mandatoryFields = ['path', 'microservice', 'port', 'method'];

    if (!payload.path || !payload.microservice || !payload.port || !payload.method) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `Required parameter is missing`;
        response.isValid = false;

        for(const field of mandatoryFields) {
            if (!payload[field]) {
                response.resMsg += `: ${field}`;
                break;
            }
        }
    }

    if (payload.port && typeof payload.port !== 'number') {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `Provided port is not a valid number`;
        response.isValid = false;
    }
    if (payload.method && !isValidMethod(payload.method)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `Provided method is not a valid API method`;
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

const validateNewUserRolePayload = (payload) => {
    log.info('Payload verification execution started');
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };

    if (!payload.roleCode || !payload.roleName || !payload.isDefault) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `Required parameter is missing`;
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

const validateNewScopePayload = (payload) => {
    log.info('Payload verification execution started');
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };

    if (!payload.roleId || !payload.scope || !payload.scopeDesc) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `Required parameter is missing`;
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

export {
    validateCreateSettingPayload,
    validateNewRoutePayload,
    validateNewUserRolePayload,
    validateNewScopePayload
};
