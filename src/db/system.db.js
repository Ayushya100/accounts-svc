'use strict';

import { exec, logger } from 'lib-finance-svc';

const log = logger('db');

const executeQuery = async(query, params = []) => {
    try {
        return await exec(query, params);
    } catch (err) {
        log.error(JSON.stringify(err));
    }
}

const fetchServiceDetail = async(serviceId = '', microservice = '', environment = '', protocol = '', noServiceId = '') => {
    let query = `SELECT id, microservice, environment, protocol, port, TO_CHAR(created_on, 'YYYY-MM-DD') created_on, TO_CHAR(modified_on, 'YYYY-MM-DD') modified_on
        FROM svc_configs
        WHERE is_deleted = false`;
    const params = [];

    if (serviceId !== '') {
        query += ' AND id = ?';
        params.push(serviceId);
    }

    if (microservice !== '') {
        query += ' AND microservice = ?';
        params.push(microservice);
    }

    if (environment !== '') {
        query += ' AND environment = ?';
        params.push(environment);
    }

    if (protocol !== '') {
        query += ' AND protocol = ?';
        params.push(protocol);
    }

    if (noServiceId !== '') {
        query += ' AND id <> ?';
        params.push(noServiceId);
    }
    
    const result = await executeQuery(query, params);
    return result;
}

const registerService = async(serviceConfig) => {
    let query = `INSERT INTO svc_configs (microservice, environment, protocol, port)
        VALUES (?, ?, ?, ?)`;

    const result = await executeQuery(query, [serviceConfig.microservice, serviceConfig.environment, serviceConfig.protocol, serviceConfig.port]);
    return result;
}

const updateService = async(serviceId, serviceConfig) => {
    let query = `UPDATE svc_configs SET microservice = ?, environment = ?, protocol = ?
        WHERE id = ?
        RETURNING id, microservice, environment, protocol, port, TO_CHAR(created_on, 'YYYY-MM-DD') created_on, TO_CHAR(modified_on, 'YYYY-MM-DD') modified_on;`;

    const result = await executeQuery(query, [serviceConfig.microservice, serviceConfig.environment, serviceConfig.protocol, serviceId]);
    return result;
}

export {
    fetchServiceDetail,
    registerService,
    updateService
};
