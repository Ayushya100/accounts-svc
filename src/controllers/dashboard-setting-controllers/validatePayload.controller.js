'use strict';

import { logger } from 'lib-finance-service';

const log = logger('controller: validate-payload');

const returnValidationConfirmation = () => {
    log.info('Requested Payload validation completed successfully');
}

const validateCreateSettingPayload = (payload) => {
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };

    const mandatoryFields = ['categoryName', 'categoryDescription', 'categoryType', 'subCategory', 'defaultValue'];

    if (!payload.categoryName || !payload.categoryDescription || !payload.categoryType || !payload.subCategory || !payload.defaultValue || payload.isPeriodic === '') {
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

    if (payload.isPeriodic && !payload.duration) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `Required parameter cannot be empty - duration missing`;
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

export {
    validateCreateSettingPayload
};
