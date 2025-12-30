'use strict';

const SVC_API = '/accounts-svc/api/v1.0';

const serviceConfig = {
  serviceName: 'accounts-svc',
  HOST: 'localhost',
  PORT: 4800,
  PROTOCOL: 'http',
};

const SALT_ROUNDS = 10;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
};

export { SVC_API, serviceConfig, SALT_ROUNDS, COOKIE_OPTIONS };
