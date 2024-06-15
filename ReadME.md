# About Finance Tracker - Accounts-svc
## Introduction
Welcome to the GitHub repository for **Finance Tracker Accounts SVC** - This service is responsible for managing user accounts and their information. It provides functionality for user registration, authentication, and profile management, allowing users to securely manage their expenses, investments, and incomes
## Project Status: Under Development
### What's Happening Now:
- The service is currently being developed to create the functionalities to register and manage user accounts related information.
## Features
- User registration: Allow users to create new accounts by providing necessary information.
- Authentication: Verify user identity through secure authentication mechanisms.
- Profile management: Ensure users to update their profile information and manage their account settings.
## APIs
- sync-setup API: The 'sync-setup' API checks and inserts database records for service routes, user roles, role scopes, and dashboard settings. It ensures that these configurations are up-to-date and consistent. This API helps automate the maintenance of essential system settings in the database.  
POST - sync-setup
- system-setup API: The 'system-setup' API retrieves the system's basic setup details required by the UI for default operations. This API provides essential configuration data to initialize and run the user interface smoothly.  
GET - system-setup
- register-setting API: The 'register-setting' API allows administrator to register new dashboard settings to be used by users within the application.  
POST - register-setting
- setting-info API: The 'setting-info' API retrieves details of dashboard settings available in the system, which users can utilize.  
GET - setting-info  
GET - setting-info/:label
- register-route API: The 'register-route' API allows for the registration of new service routes in the database, enabling the system to trigger requests based on these routes.  
POST - register-route
- app-route API: The 'app-route' API retrieves all registered service routes from the database. Users can also pass a 'routeId' to get a specific service route record.  
GET - app-route  
GET - app-route/:routeId
- app-route API: The 'app-route' API allows users to update the information of registered service routes in the database. Users need to pass the 'routeId' for the route they want to update.  
PUT - app-route/:routeId
- app-route API: The 'app-route' API allows users to delete the information of registered service routes in the database. Users need to pass the 'routeId' of the route they want to delete.  
DELETE - app-route/:routeId
- register-user-role API: The 'register-user-role' API allows administrators to create new user roles in the database. This helps in managing user permissions and access levels within the system.  
POST - register-user-role
- user-role APi: The 'user-role' API retrieves information about all user roles available in the system. Users can also provide a 'roleId' to get details of a specific user role.  
GET - user-role  
GET - user-role/:roleId
- user-role API: The 'user-role' API allows users to update the information of an existing user role in the database. Users need to pass the 'roleId' of the role they want to update.  
PUT - user-role/:roleId
- user-role API: The 'user-role' API allows users to delete an existing user role from the database. Users need to pass the 'roleId' of the role they want to delete.  
DELETE - user-role/:roleId
  
- register-user API: The 'register-user' API allows for the registration of new users in the system. This API collects necessary user information and creates a new user account.  
POST - register-user
- verify-user API: The 'verify-user' API is used to verify a user's account by checking the provided verification code. This ensures that the user has access to the email associated with their account.  
PUT - :userId/verify-user
- login-user API: The 'login-user' API is used for authenticating users and generating a session token upon successful login.  
POST - login-user
- refresh-token API: The 'refresh-token' API is used to generate a new access token using a refresh token, extending the validity period of the user's session without requiring reauthentication.  
POST - refresh-token
---
**Finance Tracker** - Simplifying Financial Management for Everyone!