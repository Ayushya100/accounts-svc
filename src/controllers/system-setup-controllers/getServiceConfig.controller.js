'use strict';

import { Controller } from 'lib-finance-svc';
import { fetchServiceDetail } from '../../db/index.js';

const controller = new Controller('get-service-config');

const getAllServiceConfig = async() => {
    try {
        controller.logMsg();
        controller.logInfo('info', 'Execution for retrieving the service configuration list controller started');
        
        controller.logInfo('info', 'Call db query to get the list of services');
        const serviceConfigList = await fetchServiceDetail();
        
        controller.logInfo('success', 'Service configuration list retrieved successfully');
        if (serviceConfigList.rowCount === 0) {
            return {
                status: 204,
                message: 'No service configuration record exist',
                data: serviceConfigList.rows,
                isValid: true
            };
        }

        return {
            status: 200,
            message: 'All service configurations found',
            data: serviceConfigList.rows,
            isValid: true
        };
    } catch (err) {
        controller.logInfo('error', 'Error while working with db to get all service configuration records');
        return {
            status: 500,
            message: 'Some error occurred while working with db to fetch service configurations',
            stack: err.stack,
            isValid: false
        };
    }
}

const getServiceDetail = async(serviceId) => {
    try {
        controller.logMsg();
        controller.logInfo('info', 'Execution for retrieving the service detail controller started');

        controller.logInfo('info', `Call db query to get the detail of requested service by id : ${serviceId}`);
        const serviceDetail = await fetchServiceDetail(serviceId);

        if (serviceDetail.rowCount === 0) {
            controller.logInfo('error', `No record found for requested service by id : ${serviceId}`);
            return {
                status: 404,
                message: 'No service info with the given serviceId was found',
                data: [],
                isValid: false
            }
        }

        controller.logInfo('success', 'Service configuration detail retrieved successfully');
        return {
            status: 200,
            message: 'Service details retrieved',
            data: serviceDetail.rows,
            isValid: true
        };
    } catch (err) {
        controller.logInfo('error', 'Error while working with db to get the service configuration record for provided id');
        return {
            status: 500,
            message: 'Some error occurred while working with db to fetch service detail',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getAllServiceConfig,
    getServiceDetail
};
