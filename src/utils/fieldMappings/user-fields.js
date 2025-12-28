'use strict';

const userMappingFields = {
  first_name: 'first_name',
  last_name: 'last_name',
  username: 'username',
  email_id: 'email_id',
  password: 'password',
  role_id: 'role_id',
  login_type: 'login_type',
};

const userMetadataMappingField = {
  id: 'id',
  user_id: 'user_id',
  verification_token: 'verification_token',
  verification_token_exp: 'verification_token_exp',
  forgot_password_token: 'forgot_password_token',
  forgot_password_token_exp: 'forgot_password_token_exp',
  refresh_token: 'refresh_token',
};

const userFields = {
  id: 'id',
  role_id: 'role_id',
  role_cd: 'role_cd',
  first_name: 'first_name',
  last_name: 'last_name',
  username: 'username',
  email_id: 'email_id',
  login_type: 'login_type',
  is_verified: 'is_verified',
  created_date: 'created_date',
  modified_date: 'modified_date',
  login_count: 'login_count',
  last_login: 'last_login',
};

const userMetadataField = {
  id: 'id',
  user_id: 'user_id',
  verification_token: 'verification_token',
  verification_token_exp: 'verification_token_exp',
  forgot_password_token: 'forgot_password_token',
  forgot_password_token_exp: 'forgot_password_token_exp',
  refresh_token: 'refresh_token',
};

export { userMappingFields, userMetadataMappingField, userFields, userMetadataField };
