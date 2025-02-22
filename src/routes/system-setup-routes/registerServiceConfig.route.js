'use strict';

import { Router, buildApiResponse } from 'lib-finance-svc';
import controller from '../../controllers/index.js';
import utils from '../../utils/index.js';

const router = new Router('register-service-config');
const serviceController = controller.serviceController;

// API Function
const registerServiceConfig = async(req, res, next) => {
    try {
        router.logMsg();
        router.logRequest(req);

        const serviceConfig = req.body;

        router.logInfo('info', 'Call controller function to validate the requested service configuration already exists or not');
        const isServiceAvailable = await serviceController.validateNewConfig(serviceConfig);

        if (!isServiceAvailable.isValid) {
            throw isServiceAvailable;
        }

        router.logInfo('info', 'Call controller function to register new service configuration in system');
        const newServiceInfo = await serviceController.registerNewService(serviceConfig);

        if (!newServiceInfo.isValid) {
            throw newServiceInfo;
        }

        router.logInfo('success', 'Successfully registered new service configuration in system');
        res.status(newServiceInfo.status).json(buildApiResponse(newServiceInfo));
    } catch (err) {
        router.logInfo('error', utils.logError(err));
        next(err);
    }
}

export default registerServiceConfig;
