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
  const query = `SELECT ID, HEADER_CD, HEADER_DESC, IS_ACTIVE, CORE, CREATED_DATE, MODIFIED_DATE
        FROM DASHBOARD_SETUP_HEADER
        WHERE ID = ? AND IS_DELETED = ?;`;
  const params = [headerId, deletedRecord];

  return exec(query, params);
};

const getAllHeaders = async () => {
  const query = `SELECT ID, HEADER_CD, HEADER_DESC, IS_ACTIVE FROM DASHBOARD_SETUP_HEADER WHERE IS_DELETED = false;`;
  return exec(query);
};

const updateHeaderInfo = async (userId, headerId, payload) => {
  const query = `UPDATE DASHBOARD_SETUP_HEADER SET HEADER_DESC = ?, MODIFIED_BY = ?
    WHERE IS_DELETED = false AND ID = ?;`;
  const params = [payload.headerDesc, userId, headerId];

  return exec(query, params);
};

const isDashboardCategoryAvailable = async (categoryCode) => {
  const query = `SELECT ID FROM DASHBOARD_SETUP WHERE CATEGORY_CD = ? AND IS_DELETED = false;`;
  const params = [categoryCode];
  return exec(query, params);
};

const registerNewCategory = async (payload) => {
  const query = `INSERT INTO DASHBOARD_SETUP (HEADER_ID, CATEGORY_CD, CATEGORY_NAME, USER_APPLICABLE, CATEGORY_TYPE, OPTIONS, VALUE)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    RETURNING ID`;
  const params = [payload.headerId, payload.categoryCode, payload.categoryName, payload.userAllowed, payload.categoryType, [...payload.options], payload.value];

  return exec(query, params);
};

const getCategoryById = async (categoryId, deletedRecord) => {
  const query = `SELECT S.ID, S.HEADER_ID, S.CATEGORY_CD, S.CATEGORY_NAME, S.USER_APPLICABLE, S.CATEGORY_TYPE, S.OPTIONS, S.VALUE, S.CORE, H.HEADER_CD, H.HEADER_DESC
    FROM DASHBOARD_SETUP S
    INNER JOIN DASHBOARD_SETUP_HEADER H ON H.ID = S.HEADER_ID
    WHERE S.IS_DELETED = ? AND S.ID = ?;`;
  const params = [deletedRecord, categoryId];

  return exec(query, params);
};

export { isDashboardHeaderAvailable, registerNewHeader, getHeaderById, getAllHeaders, updateHeaderInfo, isDashboardCategoryAvailable, registerNewCategory, getCategoryById };
