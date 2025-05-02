'use strict';

import { exec } from 'finance-lib';

const isRoleAvailable = async (roleCd) => {
  const query = `SELECT ID, ROLE_CD, ROLE_DESC, IS_ACTIVE, IS_DEFAULT, IS_DELETED
        FROM USER_ROLE
        WHERE ROLE_CD = ? AND IS_DELETED = false;`;
  const params = [roleCd];

  return exec(query, params);
};

const getDefaultRole = async () => {
  const query = `SELECT ID FROM USER_ROLE WHERE IS_DELETED = false AND IS_ACTIVE = true AND IS_DEFAULT = true;`;
  return exec(query);
};

const deactivateRole = async (roleId) => {
  const query = `UPDATE USER_ROLE SET IS_DEFAULT = false WHERE ID = ? AND IS_DELETED = false;`;
  const params = [roleId];
  return exec(query, params);
};

const registerNewRole = async (payload) => {
  const query = `INSERT INTO USER_ROLE (ROLE_CD, ROLE_DESC, IS_ACTIVE, IS_DEFAULT)
        VALUES (?, ?, ?, ?)
        RETURNING ID`;
  const params = [payload.roleCode, payload.roleDesc, true, payload.default];

  return exec(query, params);
};

const getUserRoleById = async (roleId) => {
  const query = `SELECT ID, ROLE_CD, ROLE_DESC, IS_ACTIVE, IS_DEFAULT, CREATED_DATE, MODIFIED_DATE
        FROM USER_ROLE
        WHERE ID = ? AND IS_DELETED = false`;
  const params = [roleId];

  return exec(query, params);
};

const getUserRoles = async () => {
  const query = `SELECT ID, ROLE_CD, ROLE_DESC, IS_ACTIVE, IS_DEFAULT FROM USER_ROLE WHERE IS_DELETED = false`;
  return exec(query);
};

const updateUserRoleById = async (userId, payload) => {
  const query = `UPDATE USER_ROLE SET ROLE_DESC = ?, IS_ACTIVE = ?, IS_DEFAULT = ?, MODIFIED_BY = ?
    WHERE ID = ? AND IS_DELETED = false;`;
  const params = [payload.roleDesc, payload.active, payload.default, userId, payload.id];

  return exec(query, params);
};

const deleteUserRoleById = async (userId, roleId) => {
  const query = `UPDATE USER_ROLE SET IS_DELETED = true, IS_ACTIVE = false, MODIFIED_BY = ?
    WHERE ID = ? AND IS_DELETED = false AND IS_DEFAULT = false;`;
  const params = [userId, roleId];

  return exec(query, params);
};

const isScopeAvailable = async (scopeCode) => {
  const query = `SELECT ID, SCOPE_CD, SCOPE_DESC, IS_DELETED FROM USER_SCOPE
    WHERE IS_DELETED = false AND SCOPE_CD = ?;`;
  const params = [scopeCode];

  return exec(query, params);
};

const registerNewScope = async (payload) => {
  const query = `INSERT INTO USER_SCOPE (SCOPE_CD, SCOPE_DESC)
    VALUES(?, ?)
    RETURNING ID`;
  const params = [payload.scopeCode, payload.scopeDesc];

  return exec(query, params);
};

const getUserScopeById = async (scopeId, deletedRecord) => {
  const query = `SELECT ID, SCOPE_CD, SCOPE_DESC, CREATED_DATE, MODIFIED_DATE
    FROM USER_SCOPE
    WHERE IS_DELETED = ? AND ID = ?;`;
  const params = [deletedRecord, scopeId];

  return exec(query, params);
};

const getUserScopes = async () => {
  const query = `SELECT ID, SCOPE_CD, SCOPE_DESC FROM USER_SCOPE WHERE IS_DELETED = false;`;
  return exec(query);
};

const updateUserScopeById = async (userId, scopeId, payload) => {
  const query = `UPDATE USER_SCOPE SET SCOPE_DESC = ?, MODIFIED_BY = ?
    WHERE IS_DELETED = false AND ID = ?;`;
  const params = [payload.scopeDesc, userId, scopeId];

  return exec(query, params);
};

const deleteUserScopeById = async (userId, scopeId) => {
  const query = `UPDATE USER_SCOPE SET IS_DELETED = true, MODIFIED_BY = ? WHERE ID = ?;`;
  const params = [userId, scopeId];

  return exec(query, params);
};

const unassignedScopesByRoleId = async (roleId) => {
  const query = `SELECT ID, SCOPE_CD, SCOPE_DESC FROM USER_SCOPE
    WHERE IS_DELETED = false AND ID NOT IN (
      SELECT SCOPE_ID FROM ROLE_SCOPE WHERE ROLE_ID = ? AND IS_DELETED = false
    );`;
  const params = [roleId];

  return exec(query, params);
};

const assignedScopesByRoleId = async (roleId) => {
  const query = `SELECT S.ID, S.SCOPE_CD, S.SCOPE_DESC
    FROM ROLE_SCOPE R
    INNER JOIN USER_SCOPE S ON S.ID = R.SCOPE_ID AND S.IS_DELETED = false
    WHERE R.IS_DELETED = false AND R.ROLE_ID = ?;`;
  const params = [roleId];

  return exec(query, params);
};

const getMultipleScopesByIds = async (idsPlaceholder, scopeIdArr) => {
  const query = `SELECT ID FROM USER_SCOPE WHERE ID IN (${idsPlaceholder}) AND IS_DELETED = false;`;
  const params = scopeIdArr;
  return exec(query, params);
};

const assignScopesToRole = async (idsPlaceholder, bindings) => {
  const query = `INSERT INTO ROLE_SCOPE (ROLE_ID, SCOPE_ID) VALUES ${idsPlaceholder}`;
  const params = bindings;
  return exec(query, params);
};

const unassignScopesToRole = async (userId, roleId, idsPlaceholder, scopeIdArr) => {
  const query = `UPDATE ROLE_SCOPE SET IS_DELETED = true, MODIFIED_BY = '${userId}'
    WHERE ROLE_ID = '${roleId}' AND SCOPE_ID IN (${idsPlaceholder});`;
  const params = scopeIdArr;

  return exec(query, params);
};

const isServiceAvailable = async (microservice, environment, protocol) => {
  const query = `SELECT ID FROM SVC_CONFIG WHERE MICROSERVICE = ? AND ENVIRONMENT = ? AND PROTOCOL = ? AND IS_DELETED = false;`;
  const params = [microservice, environment, protocol];
  return exec(query, params);
};

const registerNewService = async (payload) => {
  const query = `INSERT INTO SVC_CONFIG (MICROSERVICE, ENVIRONMENT, PROTOCOL, PORT)
    VALUES (?, ?, ?, ?)
    RETURNING ID`;
  const params = [payload.microservice, payload.environment, payload.protocol, payload.port];

  return exec(query, params);
};

const getServiceById = async (svcId) => {
  const query = `SELECT ID, MICROSERVICE, ENVIRONMENT, PROTOCOL, PORT, CREATED_DATE, MODIFIED_DATE
    FROM SVC_CONFIG
    WHERE ID = ? AND IS_DELETED = false;`;
  const params = [svcId];

  return exec(query, params);
};

const getServiceConfig = async () => {
  const query = `SELECT ID, MICROSERVICE, ENVIRONMENT, PROTOCOL, PORT FROM SVC_CONFIG WHERE IS_DELETED = false;`;
  return exec(query);
};

const isRouteAvailable = async (payload) => {
  const query = `SELECT ID FROM PATH_CONFIG WHERE SVC_ID = ? AND PATH = ? AND METHOD = ? AND IS_DELETED = false;`;
  const params = [payload.svcId, payload.path, payload.method];

  return exec(query, params);
};

const registerNewRoute = async (payload) => {
  const query = `INSERT INTO PATH_CONFIG (SVC_ID, PATH, METHOD, VALIDATIONS)
    VALUES(?, ?, ?, ?)
    RETURNING ID;`;
  const params = [payload.svcId, payload.path, payload.method, payload.validations];

  return exec(query, params);
};

const getRouteById = async (routeId) => {
  const query = `SELECT P.ID, S.ID AS SVC_ID, P.PATH, P.METHOD, P.VALIDATIONS, P.CREATED_DATE, P.MODIFIED_DATE, S.MICROSERVICE
    FROM PATH_CONFIG P
    INNER JOIN SVC_CONFIG S ON S.ID = P.SVC_ID AND S.IS_DELETED = false
    WHERE P.ID = ? AND P.IS_DELETED = false;`;
  const params = [routeId];

  return exec(query, params);
};

const getRouteConfig = async () => {
  const query = `SELECT P.ID, S.ID AS SVC_ID, P.PATH, P.METHOD, S.MICROSERVICE
    FROM PATH_CONFIG P
    INNER JOIN SVC_CONFIG S ON S.ID = P.SVC_ID AND S.IS_DELETED = false
    WHERE P.IS_DELETED = false;`;

  return exec(query);
};

export {
  isRoleAvailable,
  getDefaultRole,
  deactivateRole,
  registerNewRole,
  getUserRoleById,
  getUserRoles,
  updateUserRoleById,
  deleteUserRoleById,
  isScopeAvailable,
  registerNewScope,
  getUserScopeById,
  getUserScopes,
  updateUserScopeById,
  deleteUserScopeById,
  unassignedScopesByRoleId,
  assignedScopesByRoleId,
  getMultipleScopesByIds,
  assignScopesToRole,
  unassignScopesToRole,
  isServiceAvailable,
  registerNewService,
  getServiceById,
  getServiceConfig,
  isRouteAvailable,
  registerNewRoute,
  getRouteById,
  getRouteConfig,
};
