'use strict';

import { exec } from 'common-node-lib';

const isDashboardHeaderAvailable = async (headerCode) => {
  const query = `SELECT ID FROM DASHBOARD_SETUP_HEADER WHERE HEADER_CD = ? AND IS_DELETED = false;`;
  const params = [headerCode];

  return exec(query, params);
};

const registerNewHeader = async (payload) => {
  const query = `INSERT INTO DASHBOARD_SETUP_HEADER (HEADER_CD, HEADER_DESC) VALUES (?, ?)
        RETURNING ID;`;
  const params = [payload.headerCode, payload.headerDesc];

  return exec(query, params);
};

const getHeaderById = async (headerId, deletedRecord) => {
  const query = `SELECT ID, HEADER_CD, HEADER_DESC, IS_ACTIVE, CREATED_DATE, MODIFIED_DATE
        FROM DASHBOARD_SETUP_HEADER
        WHERE ID = ? AND IS_DELETED = ?;`;
  const params = [headerId, deletedRecord];

  return exec(query, params);
};

const getAllHeaders = async () => {
  const query = `SELECT ID, HEADER_CD, HEADER_DESC, IS_ACTIVE FROM DASHBOARD_SETUP_HEADER WHERE IS_DELETED = false;`;
  return exec(query);
};

export { isDashboardHeaderAvailable, registerNewHeader, getHeaderById, getAllHeaders };
