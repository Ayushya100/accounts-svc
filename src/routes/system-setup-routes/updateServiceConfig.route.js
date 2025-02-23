'use strict';

import { Router, buildApiResponse } from 'lib-finance-svc';
import controllers from '../../controllers/index.js';
import utils from '../../utils/index.js';

const router = new Router('update-service-config');
const serviceController = controllers.serviceController;

// API Function
const updateServiceConfig = async(req, res, next) => {
    try {
        router.logMsg();
        router.logRequest(req);

        const newServiceInfo = req.body;
        const serviceId = req.params.serviceId;

        if (
            !newServiceInfo.microservice && !newServiceInfo.environment &&
            !newServiceInfo.protocol && !newServiceInfo.port
        ) {
            router.logInfo('error', 'Request payload is empty');
            const errorMessage = {
                status: 400,
                message: 'Request payload is empty',
                data: []
            };
            throw errorMessage;
        }

        router.logInfo('info', 'Call controller function to validate if requested service configuration exists to update');
        const isServiceAvailable = await serviceController.getServiceDetail(serviceId);

        if (!isServiceAvailable.isValid) {
            throw isServiceAvailable;
        }

        const newServicePayload = {
            microservice: newServiceInfo.microservice || isServiceAvailable.data[0].microservice,
            environment: newServiceInfo.environment || isServiceAvailable.data[0].environment,
            protocol: newServiceInfo.protocol || isServiceAvailable.data[0].protocol
        }

        router.logInfo('info', 'Call controller function to validate if new service configuration already exists');
        const isNewServiceAlreadyExists = await serviceController.validateConfigBeforeUpdate(serviceId, newServicePayload);

        if (!isNewServiceAlreadyExists.isValid) {
            throw isNewServiceAlreadyExists;
        }

        router.logInfo('info', 'Call controller function to update existing service configuration with new provided configuration.');
        const updatedServiceInfo = await serviceController.updateExistingService(serviceId, newServicePayload);

        if (!updatedServiceInfo.isValid) {
            throw updatedServiceInfo;
        }

        router.logInfo('success', 'Successfully updated requested service configuration in db');
        res.status(updatedServiceInfo.status).json(buildApiResponse(updatedServiceInfo));
    } catch (err) {
        router.logInfo('error', utils.logError(err));
        next(err);
    }
}

export default updateServiceConfig;
