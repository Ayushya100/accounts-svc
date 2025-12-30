'use strict';

import jwt from 'jsonwebtoken';
import { logger } from 'common-svc-lib';

const log = logger('util: generate-token');

const generateUserAccessToken = async (userInfo) => {
  const accessToken = jwt.sign(
    {
      id: userInfo.id,
      username: userInfo.username,
      role: userInfo.role_cd,
      scopes: userInfo.scopes,
      isVerified: userInfo.is_verified,
      isDeleted: userInfo.is_deleted,
    },
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );

  log.info('Access token generated');
  return accessToken;
};

const generateUserRefreshToken = async (userInfo) => {
  const refreshToken = jwt.sign(
    {
      id: userInfo.id,
    },
    process.env.REFRESH_TOKEN_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );

  log.info('Refresh token generated');
  return refreshToken;
};

export { generateUserAccessToken, generateUserRefreshToken };
