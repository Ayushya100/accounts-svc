'use strict';

import {
    buildApiResponse,
    responseCodes,
    logger,
    getUserContext
} from 'lib-finance-service';
import controller from '../../controllers/index.js';

const header = 'route: update-app-route';
const msg = 'Update app route info router started';

const log = logger(header);
const dashboardController = controller.dashboardController;

// API Function
const updateAppRoute = async(req, res, next) => {
    log.info(msg);

    try {
        const userContext = getUserContext();
        const routeId = req.params.routeId;
        const userId = userContext.userId || req.user?.userId;
        const payload = req.body;

        log.info('Call controller function to check if app route exists in db');
        const appRouteInfo = await dashboardController.getAppRoutebyId(routeId);
        if (!appRouteInfo) {
            throw appRouteInfo;
        }

        log.info(`Call controller function to update app route for requested route id : ${routeId}`);
        const updatedInfo = await dashboardController.updateAppRoute(userId, routeId, payload, appRouteInfo.data);
        if (!updatedInfo.isValid) {
            throw updatedInfo;
        }

        log.success('Successfully updated app route info for requested route in db');
        res.status(responseCodes[updatedInfo.resType]).json(
            buildApiResponse(updatedInfo)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with db to update app route, router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default updateAppRoute;
