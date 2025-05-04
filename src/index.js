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
    // this.app.post(`${USERS_API}/refresh-token`, );                                                       -- Generate refresh token for user with expired access token
    // this.app.post(`${USERS_API}/request-reset, );                                                        -- Request password reset as forgot password request
    // this.app.post(`${USERS_API}/reset-password/:userId, );                                               -- Reset password for user after validation
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
    // this.app.put(`${USERS_API}/user/:userId`, verifyScope('USER.U'), verifyUserId, );                    -- Update User Info for provided user ID
    // this.app.put(`${USERS_API}/user/profile-img/:userId`, verifyScope('USER.U'), verifyUserId, );        -- Update User Profile image for provided user ID
    // this.app.put(`${USERS_API}/user/user-password/:userId, verifyScope('USER.U), verifyUserId, );
    // this.app.delete(`${USERS_API}/user/profile-img/:userId`, verifyScope('USER.D'), verifyUserId, );     -- Delete User Profile image for provided user ID
    // this.app.delete(`${USERS_API}/user/deactivate-user/:userId`, verifyScope('USER.D'), verifyUserId, ); -- Deactivate User Profile for provided user ID by soft deleting

    // Dashboard routes
    this.app.post(`${USERS_API}/dashboard-header`, verifyScope('SETUP.U'), routes.dashboardRoutes.registerDashboardHeader);
    this.app.get(`${USERS_API}/dashboard-header`, verifyScope('SETUP.V'), routes.dashboardRoutes.getAllDashboardHeader);
    this.app.get(`${USERS_API}/dashboard-header/:headerId`, verifyScope('SETUP.V'), routes.dashboardRoutes.getDashboardHeaderById);
    // this.app.put(`${USERS_API}/dashboard-header/:headerId`, verifyScope('SETUP.U'), );                   -- Update Dashboard Header for provided header ID
    // this.app.delete(`${USERS_API}/dashboard-header/:headerId`, verifyScope('SETUP.D'), );                -- Delete Dashboard Header for provided header ID

    // Dashboard Setup routes
    // this.app.post(`${USERS_API}/dashboard`, verifyScope('SETUP.U'), );                                   -- Register New Dashboard Setup with the provided header ID
    // this.app.get(`${USERS_API}/dashboard`, verifyScope('SETUP.V'), );                                    -- Get all Dashboard Setup info
    // this.app.get(`${USERS_API}/dashboard/:setupId`, verifyScope('SETUP.V'), );                           -- Get Dashboard Setup info for provided setup ID
    // this.app.put(`${USERS_API}/dashboard/:setupId`, verifyScope('SETUP.U'), );                           -- Update Dashboard Setup info for provided setup ID
    // this.app.delete(`${USERS_API}/dashboard/:setupId`, verifyScope('SETUP.D'), );                        -- Delete Dashboard Setup for provided setup ID

    // this.app.put(`${USERS_API}/assign-dashboard/:userId`, verifyScope('SETUP.U'), );                     -- Assign Dashboard Setup to provided user ID
  }
}

serviceConfig.HOST = process.env.HOST || serviceConfig.HOST;
serviceConfig.PORT = process.env.PORT || serviceConfig.PORT;
serviceConfig.PROTOCOL = process.env.PROTOCOL || serviceConfig.PROTOCOL;

const service = new AccountService(serviceConfig, true);
service.getUserContext();
service.buildConnection();
service.testConnection();
