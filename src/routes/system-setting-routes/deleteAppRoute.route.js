'use strict';

import {
    buildApiResponse,
    responseCodes,
    logger,
    getUserContext
} from 'lib-finance-service';
import controller from '../../controllers/index.js';

const header = 'route: delete-app-route';
const msg = 'Delete app route router started';

const log = logger(header);
const dashboardController = controller.dashboardController;

// API Function
const deleteAppRoute = async(req, res, next) => {
    log.info(msg);

    try {
        const userContext = getUserContext();
        const routeId = req.params.routeId;
        const userId = userContext.userId || req.user?.userId;

        log.info('Call controller function to check if app route exists in db');
        const appRouteInfo = await dashboardController.getAppRoutebyId(routeId);
        if (!appRouteInfo.isValid) {
            throw appRouteInfo;
        }

        log.info(`Call controller function to delete app route for requested route id : ${routeId}`);
        const updatedInfo = await dashboardController.deleteAppRoute(userId, routeId);
        if (!updatedInfo.isValid) {
            throw updatedInfo;
        }

        log.success('Successfully deleted app route from db');
        res.status(responseCodes[updatedInfo.resType]).json(
            buildApiResponse(updatedInfo)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with db to delete app route router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default deleteAppRoute;
