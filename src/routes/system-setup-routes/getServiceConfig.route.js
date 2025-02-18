'use strict'

import { Router, buildApiResponse } from 'lib-finance-svc';
import controller from '../../controllers/index.js';

const router = new Router('get-service-config');
const serviceController = controller.serviceController;

// API Function
const getServiceConfig = async(req, res, next) => {
    try {
        router.logMsg();
        router.logRequest(req);
        
        const svcId = req.params.svcId;

        if (svcId) {
            router.logInfo('info', 'Call controller function to retrieve service info by id');
            const serviceDetail = await serviceController.getServiceDetail(svcId);

            if (!serviceDetail.isValid) {
                throw serviceDetail;
            }

            router.logInfo('success', 'Successfully retrieved requested service detail from db');
            res.status(serviceDetail.resCode).json(buildApiResponse(serviceDetail));
        } else {
            router.logInfo('info', 'Call controller function to retrieve all service infos');
            const serviceConfigs = await serviceController.getAllServiceConfig();

            if (!serviceConfigs.isValid) {
                throw serviceConfigs;
            }

            router.logInfo('success', 'Successfully retrieved requested service configuration records from db');
            res.status(serviceConfigs.resCode).json(buildApiResponse(serviceConfigs));
        }
    } catch (err) {
        if (err.resCode === 500) {
            router.logInfo('error', 'Some error occurred while working with get service configuration router function');
        } else {
            router.logInfo('error', `Error occurred while processing the request at router level! Error : ${err.resCode} - ${err.resMsg}`);
        }
        next(err);
    }
}

export default getServiceConfig;
