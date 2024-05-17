'use strict';

import { buildApiResponse, responseCodes, logger } from 'lib-finance-service';
import controller from '../../controllers/index.js';

const header = 'route: get-app-route';
const msg = 'Get app route info router started';

const log = logger(header);
const dashboardController = controller.dashboardController;

// API Function
const getAppRouteInfo = async(req, res, next) => {
    try {
        const routeId = req.params.routeId;

        let appRouteInfo;
        if (routeId) {
            log.info(`Call controller function to retrieve the app route info for requested route id : ${routeId}`);
            appRouteInfo = await dashboardController.getAppRoutebyId(routeId);
        } else {
            log.info('Call controller function to retrieve all app route info');
            appRouteInfo = await dashboardController.getAllAppRouteInfo();
        }

        if (!appRouteInfo.isValid) {
            throw appRouteInfo;
        }

        log.success('Successfully retrieved requested app route records from db');
        res.status(responseCodes[appRouteInfo.resType]).json(
            buildApiResponse(appRouteInfo)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with get user role router function');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default getAppRouteInfo;
