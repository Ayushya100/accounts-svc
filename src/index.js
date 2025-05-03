'use strict';

import { Service, verifyUserId, verifyScope } from 'common-node-lib';
import dotenv from 'dotenv';
import { USERS_API, serviceConfig } from './constants.js';
import routes from './routes/index.js';

dotenv.config({
  path: './env',
});

class AccountService extends Service {
  registerPublicEndpoints() {
    this.app.get(`${USERS_API}/health`, routes.healthCheck);
    this.app.post(`${USERS_API}/register-user`, routes.users.registerUser);
    this.app.put(`${USERS_API}/verify-user/:userId/:token`, routes.users.verifyUserEmail);
    this.app.post(`${USERS_API}/login`, routes.users.loginUser);
  }

  registerServiceEndpoints() {
    // User Role routes
    this.app.post(`${USERS_API}/setup/user-role`, verifyScope('ROLE.U'), routes.settingRoutes.registerUserRole);
    this.app.get(`${USERS_API}/setup/user-role`, verifyScope('ROLE.V'), routes.settingRoutes.getAllUserRoles);
    this.app.get(`${USERS_API}/setup/user-role/:roleId`, verifyScope('ROLE.V'), routes.settingRoutes.getUserRoleById);
    this.app.put(`${USERS_API}/setup/user-role/:roleId`, verifyScope('ROLE.U'), routes.settingRoutes.updateUserRole);
    this.app.delete(`${USERS_API}/setup/user-role/:roleId`, verifyScope('ROLE.D'), routes.settingRoutes.deleteUserRole);

    // User Scope routes
    this.app.post(`${USERS_API}/setup/user-scope`, verifyScope('SCOPE.U'), routes.settingRoutes.registerUserScope);
    this.app.get(`${USERS_API}/setup/user-scope`, verifyScope('SCOPE.V'), routes.settingRoutes.getAllUserScopes);
    this.app.get(`${USERS_API}/setup/user-scope/:scopeId`, verifyScope('SCOPE.V'), routes.settingRoutes.getUserScopeById);
    this.app.put(`${USERS_API}/setup/user-scope/:scopeId`, verifyScope('SCOPE.U'), routes.settingRoutes.updateUserScope);
    this.app.delete(`${USERS_API}/setup/user-scope/:scopeId`, verifyScope('SCOPE.D'), routes.settingRoutes.deleteUserScope);
    this.app.get(`${USERS_API}/setup/assigned-scope/:roleId`, verifyScope('SCOPE.V'), routes.settingRoutes.getAssignedScopes);
    this.app.get(`${USERS_API}/setup/unassigned-scope/:roleId`, verifyScope('SCOPE.V'), routes.settingRoutes.getUnassignedScopes);
    this.app.put(`${USERS_API}/setup/assigned-scope/:roleId`, verifyScope('SCOPE.U'), routes.settingRoutes.assignScopesToRole);

    // Service routes
    this.app.post(`${USERS_API}/setup/app-service`, verifyScope('SERVICE.U'), routes.serviceRoutes.registerServiceConfig);
    this.app.get(`${USERS_API}/setup/app-service`, verifyScope('SERVICE.V'), routes.serviceRoutes.getAllServiceConfig);
    this.app.get(`${USERS_API}/setup/app-service/:svcId`, verifyScope('SERVICE.V'), routes.serviceRoutes.getServiceConfigById);
    this.app.put(`${USERS_API}/setup/app-service/:svcId`, verifyScope('SERVICE.U'), routes.serviceRoutes.updateServiceConfig);
    this.app.delete(`${USERS_API}/setup/app-service/:svcId`, verifyScope('SERVICE.D'), routes.serviceRoutes.deleteServiceConfig);
    this.app.post(`${USERS_API}/setup/app-route`, verifyScope('ROUTE.U'), routes.serviceRoutes.registerRouteConfig);
    this.app.get(`${USERS_API}/setup/app-route`, verifyScope('ROUTE.V'), routes.serviceRoutes.getAllRouteConfig);
    this.app.get(`${USERS_API}/setup/app-route/:routeId`, verifyScope('ROUTE.V'), routes.serviceRoutes.getRouteConfigById);
    this.app.put(`${USERS_API}/setup/app-route/:routeId`, verifyScope('ROUTE.U'), routes.serviceRoutes.updateRouteConfig);
    this.app.delete(`${USERS_API}/setup/app-route/:routeId`, verifyScope('ROUTE.D'), routes.serviceRoutes.deleteRouteConfig);

    // User routes
    this.app.get(`${USERS_API}/user/:userId`, verifyScope('USER.V'), verifyUserId, routes.users.userInfo);
    this.app.post(`${USERS_API}/user/logout`, verifyScope('USER.V'), routes.users.logoutUser);

    // Dashboard routes
    this.app.post(`${USERS_API}/dashboard-header`, verifyScope('SETUP.U'), routes.dashboardRoutes.registerDashboardHeader);
    this.app.get(`${USERS_API}/dashboard-header`, verifyScope('SETUP.V'), routes.dashboardRoutes.getAllDashboardHeader);
  }
}

serviceConfig.HOST = process.env.HOST || serviceConfig.HOST;
serviceConfig.PORT = process.env.PORT || serviceConfig.PORT;
serviceConfig.PROTOCOL = process.env.PROTOCOL || serviceConfig.PROTOCOL;

const service = new AccountService(serviceConfig, true);
service.getUserContext();
service.buildConnection();
service.testConnection();
