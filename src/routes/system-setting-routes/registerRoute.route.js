'use strict';

import {
    buildApiResponse,
    responseCodes,
    logger,
    getUserContext
} from 'lib-finance-service';
import controller from '../../controllers/index.js';

const header = 'route: register-route';
const msg = 'Register new route in system started';

const log = logger(header);
const dashboardController = controller.dashboardController;

// API Function
const registerRoute = async(req, res, next) => {
    log.info(msg);

    try {
        const payload = req.body;
        const userContext = getUserContext();
        const userId = userContext.userId || req.user?.userId;

        log.info('Call controller function to validate payload');
        const isValidPayload = dashboardController.validateNewRoutePayload(payload);
        if (!isValidPayload.isValid) {
            throw isValidPayload;
        }

        log.info('Call controller function to check for existing route with similar end point');
        const isRouteAvailable = await dashboardController.isRouteAvailable(payload);
        if (!isRouteAvailable.isValid && isRouteAvailable.resType === 'CONFLICT') {
            throw isRouteAvailable;
        }

        let routeCreated;
        if (isRouteAvailable.resType === 'REQUEST_COMPLETED') {
            log.info('Call controller function to register new route started');
            routeCreated = await dashboardController.createRoute(payload);
        } else if (isRouteAvailable.resType === 'SUCCESS') {
            log.info('Call controller function to restore deleted route started');
            routeCreated = await dashboardController.restoreRoute(userId, isRouteAvailable.data);
        }
        if (!routeCreated.isValid) {
            throw routeCreated;
        }

        log.success(`Successfully registered new route (${payload.path}) in db`);
        res.status(responseCodes[routeCreated.resType]).json(
            buildApiResponse(routeCreated)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with register new route router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default registerRoute;
