'use strict';

import jwt from 'jsonwebtoken';
import { logger } from 'common-node-lib';

const log = logger('util: generate-token');

const generateUserAccessToken = async (userInfo) => {
  const accessToken = jwt.sign(
    {
      id: userInfo.id,
      username: userInfo.username,
      role: userInfo.role,
      isVerified: userInfo.isEmailVerified,
      isDeleted: userInfo.isDeleted,
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
