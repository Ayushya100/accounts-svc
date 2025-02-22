'use strict';

import { Controller } from 'lib-finance-svc';
import { fetchServiceDetail, registerService } from '../../db/index.js';

const controller = new Controller('register-service-config');

const validateNewConfig = async(serviceConfig) => {
    try {
        controller.logMsg();
        controller.logInfo('info', 'Execution for verifying if the new service configuration already exists, has started');

        if (serviceConfig.microservice === '' || serviceConfig.environment === '' || serviceConfig.protocol === '') {
            controller.logInfo('error', 'One of the mandatory field required to validate if new service request configuration already exists, is missing');
            return {
                status: 400,
                message: 'Mandatory field value missing',
                data: [],
                isValid: false
            };
        }

        controller.logInfo('info', 'Call db query to verify existing service configuration detail');
        const availableServiceInfo = await fetchServiceDetail('', serviceConfig.microservice, serviceConfig.environment, serviceConfig.protocol);

        if (availableServiceInfo.rowCount !== 0) {
            controller.logInfo('error', 'Service with provided new configuration already exists.');
            return {
                status: 409,
                message: 'Service with provided new configuration already exists.',
                data: availableServiceInfo.rows,
                isValid: false
            };
        }

        controller.logInfo('success', 'New Service configuration validation completed successfully');
        return {
            status: 200,
            message: 'No existing service configuration found',
            data: availableServiceInfo.rows,
            isValid: true
        };
    } catch (err) {
        controller.logInfo('error', 'Error while working with db to verify new service configuration');
        return {
            status: 500,
            message: 'Some error occurred while working with db to verify new service configuration record',
            stack: err.stack,
            isValid: false
        };
    }
}

const registerNewService = async(serviceConfig) => {
    try {
        controller.logMsg();
        controller.logInfo('info', 'Execution for registering new service configuration in system controller started');

        controller.logInfo('info', `Call db query to register new microservice (${serviceConfig.microservice}) in system.`);
        const serviceDetail = await registerService(serviceConfig);

        controller.logInfo('success', 'New Service configuration registered successfully in system');
        return {
            status: 201,
            message: 'New Service configuration registered successfully in system',
            data: serviceDetail.rows,
            isValid: true
        };
    } catch (err) {
        controller.logInfo('error', 'Error while working with db to register new service configuration in controller');
        return {
            status: 500,
            message: 'Some error occurred while working with db to register new service configuration in system',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    validateNewConfig,
    registerNewService
};
