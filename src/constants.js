'use strict';

const USERS_API = '/accounts-svc/api/v1.0';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true
};

const serviceConfig = {
    serviceName: 'accounts-svc',
    HOST: 'localhost',
    PORT: 4800,
    timeout: 5000,
    retries: 3
};

export {
    USERS_API,
    COOKIE_OPTIONS,
    serviceConfig
};
