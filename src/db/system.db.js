'use strict';

import { db, DBQuery } from 'common-svc-lib';
import { fieldMappings } from '../utils/index.js';

class SystemDB extends DBQuery {
  constructor() {
    super();
    this.tables = {
      USER_ROLE: 'USER_ROLE',
      USER_SCOPE: 'USER_SCOPE',
      ROLE_SCOPE: 'ROLE_SCOPE',
    };
  }

  // Query Functions
  async getUserRoleByCode(roleCode) {
    const query = `SELECT ID, ROLE_CD, ROLE_DESC, IS_ACTIVE, IS_DEFAULT, CREATED_DATE, MODIFIED_DATE
      FROM ${this.tables['USER_ROLE']}
      WHERE ROLE_CD = ? AND IS_DELETED = false;`;
    const params = [roleCode];

    return await db.execute(query, params);
  }

  async getDefaultRole() {
    const query = `SELECT ID FROM ${this.tables['USER_ROLE']}
      WHERE IS_DELETED = false AND IS_ACTIVE = true AND IS_DEFAULT = true;`;
    return await db.execute(query);
  }

  async registerNewRole(payload) {
    const query = this.insertQuery('USER_ROLE', fieldMappings.userRoleMappingFields, payload);
    const params = [payload.role_code, payload.role_desc, payload.is_active, payload.is_default];
    return await db.execute(query, params);
  }

  async deactivateRole(roleId) {
    const updateRec = { IS_DEFAULT: false };
    const whereRec = {
      ID: '?',
      IS_DELETED: false,
    };

    const query = this.updateQuery('USER_ROLE', fieldMappings.userRoleMappingFields, updateRec, whereRec);
    const params = [roleId];
    return await db.execute(query, params);
  }

  async getUserRole(roleId = null) {
    let query = `SELECT ID, ROLE_CD, ROLE_DESC, IS_ACTIVE, IS_DEFAULT, CREATED_DATE, MODIFIED_DATE
      FROM ${this.tables['USER_ROLE']}
      WHERE IS_DELETED = false`;
    let params = [];

    if (roleId) {
      query += ' AND ID = ?';
      params.push(roleId);
    }

    return await db.execute(query, params);
  }

  async getDefaultUserRole() {
    const query = `SELECT ID FROM ${this.tables['USER_ROLE']}
      WHERE IS_DELETED = false AND IS_ACTIVE = true AND IS_DEFAULT = true;`;
    return await db.execute(query);
  }

  async getUserScope(roleId) {
    const query = `SELECT S.ID, S.SCOPE_CD, S.SCOPE_DESC
      FROM ${this.tables['ROLE_SCOPE']} R
      INNER JOIN ${this.tables['USER_SCOPE']} S ON S.ID = R.SCOPE_ID AND S.IS_DELETED = false
      WHERE R.ROLE_ID = ? AND R.IS_DELETED = false;`;
    const params = [roleId];
    return await db.execute(query, params);
  }
}

export default new SystemDB();
