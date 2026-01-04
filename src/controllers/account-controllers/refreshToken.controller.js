'use strict';

import { _Error, convertPrettyStringToId, logger } from 'common-svc-lib';
import jwt from 'jsonwebtoken';
import { AccountDB } from '../../db/index.js';

const log = logger('Controller: Refresh-Token');

const isTokenAvailable = async (token) => {
  try {
    log.info('Controller function to validate refresh token for the user process initiated');
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);

    log.info('Valid token found');
    const userId = convertPrettyStringToId(decodedToken.id);

    log.info('Verify token from db');
    let userDtl = await AccountDB.getUserRefreshToken(userId);
    if (userDtl.rowCount === 0) {
      log.error('No Token stored in db');
      throw _Error(400, 'No Token stored in db');
    }
    userDtl = userDtl.rows[0];

    const storedToken = userDtl.refresh_token;
    if (storedToken !== token) {
      log.error('Token mismatch between stored in db and provided by the user');
      throw _Error(400, 'Invalid Token found');
    }

    log.success('Token validation completed successfully');
    return userId;
  } catch (err) {
    log.error('Token has been Expired or Invalid');
    throw _Error(401, 'Token Expired or Invalid', err);
  }
};

export { isTokenAvailable };
