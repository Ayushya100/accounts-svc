'use strict';

import { db } from 'common-svc-lib';
import { DBQuery } from './index.js';

const userRoleMappingFields = {
  role_code: 'role_cd',
  role_desc: 'role_desc',
  is_active: 'is_active',
  is_default: 'is_default',
};

class SystemDB extends DBQuery {
  constructor() {
    super();
    this.tables = {
      USER_ROLE: 'USER_ROLE',
    };
  }

  // Query Functions
  async getUserRoleByCode(roleCode) {
    const query = `SELECT ID, ROLE_CD, ROLE_DESC, IS_ACTIVE, IS_DEFAULT, CREATED_DATE, MODIFIED_DATE
      FROM ${this.tables['USER_ROLE']}
      WHERE ROLE_CD = ? AND IS_DELETED = false;`;
    const params = [roleCode];

    return db.execute(query, params);
  }

  async getDefaultRole() {
    const query = `SELECT ID FROM ${this.tables['USER_ROLE']}
      WHERE IS_DELETED = false AND IS_ACTIVE = true AND IS_DEFAULT = true;`;
    return db.execute(query);
  }

  async registerNewRole(payload) {
    const query = this.insertQuery('USER_ROLE', userRoleMappingFields, payload);
    const params = [payload.role_code, payload.role_desc, payload.is_active, payload.is_default];
    return db.execute(query, params);
  }

  async deactivateRole(roleId) {
    const updateRec = { IS_DEFAULT: false };
    const whereRec = {
      ID: '?',
      IS_DELETED: false,
    };

    const query = this.updateQuery('USER_ROLE', userRoleMappingFields, updateRec, whereRec);
    const params = [roleId];
    return db.execute(query, params);
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

    return db.execute(query, params);
  }
}

export default new SystemDB();
