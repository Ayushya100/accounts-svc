'use strict';

import { logger } from 'lib-finance-service';
import dbConnect from '../db/index.js';
import axios from 'axios';

const header = 'util: request-external-svc';
const log = logger(header);

let externalSvcConfig = {};

const getPathDetails = async(path, microservice, method) => {
    try {
        const pathDetails = await dbConnect.isRouteAvailable({
            path: {
                $regex: path,
                $options: 'i'
            },
            microservice: microservice,
            method: method
        });

        if (pathDetails) {
            return {
                pathDetails: pathDetails,
                status: true
            };
        }
        return {
            status: false
        };
    } catch (err) {
        return {
            status: false
        };
    }
}

const initializeSvc = (svc, port) => {
    log.info('External service config started');
    const host = process.env.NODE_ENV == 'dev' ? `http://localhost:${port}/${svc}` : ``;
    externalSvcConfig.host = host;
    log.info('External service config completed');
}

const sendRequest = async(path, method, payload, accessToken = null, jsonData = null) => {
    log.info('Execution of external service request started');

    try {
        let baseUrl = `${externalSvcConfig.host}${path}`;
        let options = {
            method: method,
            url: baseUrl,
            baseUrl: baseUrl,
            data: payload,
            timeout: 50000,
            headers: { accept: 'application/json, text/plain, */*', 'content-type': 'application/json' },
            responseType: 'json'
        };

        if (accessToken) {
            options.headers = { ...options.headers, Authorization: 'Bearer ' + accessToken };
        }

        let response;
        await axios(options).then(res => {
            response = {
                statusCode: res.data.statusCode,
                message: res.data.message,
                isValid: res.data.success
            };
        }).catch(err => {
            response = {
                statusCode: err.response.data.statusCode,
                message: err.response.data.errors,
                isValid: false
            };
        });
        log.info('Execution of external service request is successfully finished');
        return response;
    } catch (err) {
        log.error('Internal Error occurred while calling the external service');
        next({
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: err,
            stack: err.stack,
            isValid: false
        });
    }
}

const sendMail = async(payload) => {
    const url = `emails/send-mail`;
    const microservice = 'email-svc';
    const method = 'POST'

    const pathFound = await getPathDetails(url, microservice, method);
    if (pathFound.status) {
        const path = pathFound.pathDetails.path;
        const port = pathFound.pathDetails.port;
    
        initializeSvc(microservice, port);
        return await sendRequest(path, method, payload);
    }
    return {
        statusCode: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to send mail try getting verification link via login',
        isValid: false
    };
}

export {
    sendMail
};
