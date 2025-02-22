'use strict'

import { Router, buildApiResponse } from 'lib-finance-svc';
import controller from '../../controllers/index.js';
import utils from '../../utils/index.js';

const router = new Router('get-service-config');
const serviceController = controller.serviceController;

// API Function
const getServiceConfig = async(req, res, next) => {
    try {
        router.logMsg();
        router.logRequest(req);
        
        const serviceId = req.params.serviceId;

        if (serviceId) {
            router.logInfo('info', 'Call controller function to retrieve service info by id');
            const serviceDetail = await serviceController.getServiceDetail(serviceId);

            if (!serviceDetail.isValid) {
                throw serviceDetail;
            }

            router.logInfo('success', 'Successfully retrieved requested service detail from db');
            res.status(serviceDetail.status).json(buildApiResponse(serviceDetail));
        } else {
            router.logInfo('info', 'Call controller function to retrieve all service infos');
            const serviceConfigs = await serviceController.getAllServiceConfig();

            if (!serviceConfigs.isValid) {
                throw serviceConfigs;
            }

            router.logInfo('success', 'Successfully retrieved requested service configuration records from db');
            res.status(serviceConfigs.status).json(buildApiResponse(serviceConfigs));
        }
    } catch (err) {
        router.logInfo('error', utils.logError(err));
        next(err);
    }
}

export default getServiceConfig;
