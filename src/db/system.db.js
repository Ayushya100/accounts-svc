'use strict';

import { exec } from 'lib-finance-svc';

const fetchServiceDetail = async(serviceId = '') => {
    try {
        let query = `SELECT id, microservice, environment, protocol, port, TO_CHAR(created_on, 'YYYY-MM-DD') created_on, TO_CHAR(modified_on, 'YYYY-MM-DD') modified_on
            FROM svc_configs
            WHERE is_deleted = false`;
        const params = [];

        if (serviceId !== '') {
            query += ' AND id = ?';
            params.push(serviceId);
        }
        
        const result = await exec(query, params);
        return result;
    } catch (err) {
        console.log(err);
    }
}

export {
    fetchServiceDetail
};
