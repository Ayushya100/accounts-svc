'use strict';

import moment from 'moment-timezone';

const USERS_API = '/accounts-svc/api/v1.0/users';
const EMAIL_SVC_URL = 'http://localhost:4000/email-svc';
const IST_CURRENT_DATE = moment().tz('Asia/Kolkata').toDate();

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true
};

export {
    USERS_API,
    COOKIE_OPTIONS,
    EMAIL_SVC_URL,
    IST_CURRENT_DATE
};
