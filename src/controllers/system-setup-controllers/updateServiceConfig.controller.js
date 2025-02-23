'use strict';

import { Controller } from 'lib-finance-svc';
import { fetchServiceDetail, updateService } from '../../db/index.js';

const controller = new Controller('update-service-config');

const validateConfigBeforeUpdate = async(serviceId, validateServiceConfig) => {
    try {
        controller.logMsg();
        controller.logInfo('info', 'Execution for verifying if the updated service configuration already exists');

        controller.logInfo('info', 'Call db query to verify if the updated service configuration already exists or not');
        const availableServiceInfo = await fetchServiceDetail('', validateServiceConfig.microservice, validateServiceConfig.environment, validateServiceConfig.protocol, serviceId);

        if (availableServiceInfo.rowCount !== 0) {
            controller.logInfo('error', 'Service with requested new configuration already exists.');
            return {
                status: 409,
                message: 'Service with requested new configuration already exists.',
                data: availableServiceInfo.rows,
                isValid: false
            };
        }

        controller.logInfo('success', 'Service with requested new configuration does not exists.');
        return {
            status: 200,
            message: 'Service with requested new configuration does not exists.',
            data: availableServiceInfo.rows,
            isValid: true
        };
    } catch (err) {
        controller.logInfo('error', 'Error while working with db to verify if service with new configuration already exists.');
        return {
            status: 500,
            message: 'Some error occurred while working with db to verify if service with new configuration already exists.',
            stack: err.stack,
            isValid: false
        };
    }
}

const updateExistingService = async(serviceId, newServiceConfig) => {
    try {
        controller.logMsg();
        controller.logInfo('info', 'Execution for updating the existing service configuration with new configuration started');

        if (!newServiceConfig.microservice || !newServiceConfig.environment || !newServiceConfig.protocol) {
            controller.logInfo('error', 'One of the required parameters to update service configuration not received for executing query');
            return {
                status: 400,
                message: 'One of the required parameters to update service configuration not received.',
                data: [],
                isValid: false
            };
        }

        controller.logInfo('info', 'Call db query to update existing service configuration.');
        const updatedServiceInfo = await updateService(serviceId, newServiceConfig);

        controller.logInfo('success', 'Requested service configuration updated successfully in db.');
        return {
            status: 200,
            message: 'Requested service configuration updated successfully',
            data: updatedServiceInfo.rows,
            isValid: true
        };
    } catch (err) {
        controller.logInfo('error', 'Error while working with db to update existing service configuration with newly provided configuration.');
        return {
            status: 500,
            message: 'Error while working with db to update existing service service with new configuration provided.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    validateConfigBeforeUpdate,
    updateExistingService
};
