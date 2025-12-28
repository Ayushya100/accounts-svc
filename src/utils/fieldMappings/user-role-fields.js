'use strict';

const userRoleMappingFields = {
  role_code: 'role_cd',
  role_desc: 'role_desc',
  is_active: 'is_active',
  is_default: 'is_default',
};

const userRoleFields = {
  id: 'id',
  role_cd: 'role_code',
  role_desc: 'role_desc',
  is_active: 'is_active',
  is_default: 'is_default',
  created_date: 'created_date',
  modified_date: 'modified_date',
  is_deleted: 'is_deleted',
};

export { userRoleMappingFields, userRoleFields };
