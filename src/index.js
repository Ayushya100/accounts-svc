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
    this.app.post(`${USERS_API}/setup/role`, verifyScope('ROLE.U'), routes.settingRoutes.registerUserRole);
    this.app.get(`${USERS_API}/setup/role`, verifyScope('ROLE.V'), routes.settingRoutes.getUserRoles);
    this.app.get(`${USERS_API}/setup/role/:roleId`, verifyScope('ROLE.V'), routes.settingRoutes.getUserRoles);
    this.app.put(`${USERS_API}/setup/role/:roleId`, verifyScope('ROLE.U'), routes.settingRoutes.updateUserRole);
    this.app.delete(`${USERS_API}/setup/role/:roleId`, verifyScope('ROLE.D'), routes.settingRoutes.deleteUserRole);

    // User Scope routes
    this.app.post(`${USERS_API}/setup/scope`, verifyScope('SCOPE.U'), routes.settingRoutes.registerUserScope);
    this.app.get(`${USERS_API}/setup/scope`, verifyScope('SCOPE.V'), routes.settingRoutes.getUserScopes);
    this.app.get(`${USERS_API}/setup/scope/:scopeId`, verifyScope('SCOPE.V'), routes.settingRoutes.getUserScopes);
    this.app.put(`${USERS_API}/setup/scope/:scopeId`, verifyScope('SCOPE.U'), routes.settingRoutes.updateUserScope);
    this.app.delete(`${USERS_API}/setup/scope/:scopeId`, verifyScope('SCOPE.D'), routes.settingRoutes.deleteUserScope);
    this.app.get(`${USERS_API}/setup/scope/assigned/:roleId`, verifyScope('SCOPE.V'), routes.settingRoutes.getAssignedScopes);
    this.app.get(`${USERS_API}/setup/scope/unassigned/:roleId`, verifyScope('SCOPE.V'), routes.settingRoutes.getUnassignedScopes);
    this.app.put(`${USERS_API}/setup/scope/assigned/:roleId`, verifyScope('SCOPE.U'), routes.settingRoutes.assignScopesToRole);

    // Service routes
    this.app.post(`${USERS_API}/setup/service`, verifyScope('SERVICE.U'), routes.serviceRoutes.registerServiceConfig);
    this.app.get(`${USERS_API}/setup/service`, verifyScope('SERVICE.V'), routes.serviceRoutes.getServiceConfig);
    this.app.get(`${USERS_API}/setup/service/:svcId`, verifyScope('SERVICE.V'), routes.serviceRoutes.getServiceConfig);
    this.app.put(`${USERS_API}/setup/service/:svcId`, verifyScope('SERVICE.U'), routes.serviceRoutes.updateServiceConfig);
    this.app.delete(`${USERS_API}/setup/service/:svcId`, verifyScope('SERVICE.D'), routes.serviceRoutes.deleteServiceConfig);
    this.app.post(`${USERS_API}/setup/route`, verifyScope('ROUTE.U'), routes.serviceRoutes.registerRouteConfig);
    this.app.get(`${USERS_API}/setup/route`, verifyScope('ROUTE.V'), routes.serviceRoutes.getRouteConfig);
    this.app.get(`${USERS_API}/setup/route/:routeId`, verifyScope('ROUTE.V'), routes.serviceRoutes.getRouteConfig);
    this.app.put(`${USERS_API}/setup/route/:routeId`, verifyScope('ROUTE.U'), routes.serviceRoutes.updateRouteConfig);
    this.app.delete(`${USERS_API}/setup/route/:routeId`, verifyScope('ROUTE.D'), routes.serviceRoutes.deleteRouteConfig);

    // User routes
    this.app.get(`${USERS_API}/user/:userId`, verifyScope('USER.V'), verifyUserId, routes.users.userInfo);
    this.app.post(`${USERS_API}/user/logout`, verifyScope('USER.V'), routes.users.logoutUser);
    // this.app.put(`${USERS_API}/user/:userId`, verifyScope('USER.U'), verifyUserId, );                    -- Update User Info for provided user ID
    // this.app.put(`${USERS_API}/user/profile-img/:userId`, verifyScope('USER.U'), verifyUserId, );        -- Update User Profile image for provided user ID
    // this.app.put(`${USERS_API}/user/password/:userId, verifyScope('USER.U), verifyUserId, );
    // this.app.delete(`${USERS_API}/user/profile-img/:userId`, verifyScope('USER.D'), verifyUserId, );     -- Delete User Profile image for provided user ID
    // this.app.delete(`${USERS_API}/user/deactivate-user/:userId`, verifyScope('USER.D'), verifyUserId, ); -- Deactivate User Profile for provided user ID by soft deleting

    // Dashboard routes
    this.app.post(`${USERS_API}/dashboard/header`, verifyScope('SETUP.U'), routes.dashboardRoutes.registerDashboardHeader);
    this.app.get(`${USERS_API}/dashboard/header`, verifyScope('SETUP.V'), routes.dashboardRoutes.getDashboardHeader);
    this.app.get(`${USERS_API}/dashboard/header/:headerId`, verifyScope('SETUP.V'), routes.dashboardRoutes.getDashboardHeader);
    this.app.put(`${USERS_API}/dashboard/header/:headerId`, verifyScope('SETUP.U'), routes.dashboardRoutes.updateDashboardHeader);
    // this.app.delete(`${USERS_API}/dashboard/header/:headerId`, verifyScope('SETUP.D'), );                -- Delete Dashboard Header for provided header ID

    // Dashboard Setup routes
    this.app.post(`${USERS_API}/dashboard/category`, verifyScope('SETUP.U'), routes.dashboardRoutes.registerDashboardCategory);
    this.app.get(`${USERS_API}/dashboard/category`, verifyScope('SETUP.V'), routes.dashboardRoutes.getDashboardCategory);
    this.app.get(`${USERS_API}/dashboard/category/:categoryId`, verifyScope('SETUP.V'), routes.dashboardRoutes.getDashboardCategory);
    // this.app.put(`${USERS_API}/dashboard/category/:categoryId`, verifyScope('SETUP.U'), );                           -- Update Dashboard Setup info for provided setup ID
    // this.app.delete(`${USERS_API}/dashboard/category/:categoryId`, verifyScope('SETUP.D'), );                        -- Delete Dashboard Setup for provided setup ID

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
