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
                resCode: 204,
                resMsg: 'No service configuration record exist',
                data: serviceConfigList.rows,
                isValid: true
            };
        }

        return {
            resCode: 200,
            resMsg: 'All service configurations found',
            data: serviceConfigList,
            isValid: true
        };
    } catch (err) {
        controller.logInfo('error', 'Error while working with db to get all service configuration records');
        return {
            resCode: 500,
            resMsg: 'Some error occurred while working with db to fetch service configurations',
            stack: err.stack,
            isValid: false
        };
    }
}

const getServiceDetail = async(svcId) => {
    try {
        controller.logMsg();
        controller.logInfo('info', 'Execution for retrieving the service detail controller started');

        controller.logInfo('info', `Call db query to get the detail of requested service by id : ${svcId}`);
        const serviceDetail = await fetchServiceDetail(svcId);

        if (serviceDetail.rowCount === 0) {
            controller.logInfo('error', `No record found for requested service by id : ${svcId}`);
            return {
                resCode: 404,
                resMsg: 'No service record found for requested id',
                data: [],
                isValid: false
            }
        }

        controller.logInfo('success', 'Service configuration detail retrieved successfully');
        return {
            resCode: 200,
            resmsg: 'Service details retrieved',
            data: serviceDetail,
            isValid: true
        };
    } catch (err) {
        controller.logInfo('error', 'Error while working with db to get the service configuration record for provided id');
        return {
            resCode: 500,
            resMsg: 'Some error occurred while working with db to fetch service detail',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getAllServiceConfig,
    getServiceDetail
};
