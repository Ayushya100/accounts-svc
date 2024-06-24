# About Finance Tracker - Accounts-svc
## Introduction
Welcome to the GitHub repository for **Finance Tracker Accounts SVC** - This service is responsible for managing user accounts and their information. It provides functionality for user registration, authentication, and profile management, allowing users to securely manage their expenses, investments, and incomes
## Project Status: Under Development
### What's Happening Now:
- The service is currently being developed to create the functionalities to register and manage user accounts related information.
## Features
#### Overview
Our system provides essential APIs designed specifically for integration within a finance tracker application. These APIs facilitate secure user authentication, profile management, role-based access control, and dynamic system configuration.
#### Key Features
- **User Management:** Register, verify, login, and manage user profiles securely. Update user details, passwords, and manage session lifecycles with ease.
- **Role-Based Access Control:** Define and manage user roles with specific scopes to control access to system resources and functionalities.
- **System Configuration:** Set up and synchronize service routes, dashboard settings, and other system configurations dynamically.
- **Customizable User Settings:** Allow users to personalize their experience with customizable settings tailored to their preferences.
- **Profile Management:** Upload, update, and delete user profile images, enhancing user interaction and personalization.
#### Usage
Our APIs are integrated seamlessly into our finance tracker application to enhance user management, security, and operational efficiency.
#### Security
Robust security measures are integrated in our finance tracker application. Implemented HTTPS encryption for secure data transmission and added validation for JWT bearer tokens to authenticate and authorize user access. Protected sensitive financial information and adhere to industry best practices for data security and privacy.
## APIs
#### Setup APIs
- sync-setup API: The 'sync-setup' API checks and inserts database records for service routes, user roles, role scopes, and dashboard settings. It ensures that these configurations are up-to-date and consistent. This API helps automate the maintenance of essential system settings in the database.  
POST - /sync-setup
- system-setup API: The 'system-setup' API retrieves the system's basic setup details required by the UI for default operations. This API provides essential configuration data to initialize and run the user interface smoothly.  
GET - /system-setup
#### Dashboard Setting APIs
- register-setting API: The 'register-setting' API allows administrator to register new dashboard settings to be used by users within the application.  
POST - register-setting
- setting-info API: The 'setting-info' API retrieves details of dashboard settings available in the system, which users can utilize.  
GET - /setting-info  
GET - /setting-info/:label
- setting-info API:  The 'setting-info' API allows users to update the information of dashboard settings in the database. User can update multiple records at once or update a single record by providing its 'setupId'.  
PUT - /setting-info  
PUT - /setting-info/:id
#### Service Route APIs
- register-route API: The 'register-route' API allows for the registration of new service routes in the database, enabling the system to trigger requests based on these routes.  
POST - /register-route
- app-route API: The 'app-route' API retrieves all registered service routes from the database. Users can also pass a 'routeId' to get a specific service route record.  
GET - /app-route  
GET - /app-route/:routeId
- app-route/:routeId API: The 'app-route' API allows users to update the information of registered service routes in the database. Users need to pass the 'routeId' for the route they want to update.  
PUT - /app-route/:routeId
- app-route/:routeId API: The 'app-route' API allows users to delete the information of registered service routes in the database. Users need to pass the 'routeId' of the route they want to delete.  
DELETE - /app-route/:routeId
#### User Role APIs
- register-user-role API: The 'register-user-role' API allows administrators to create new user roles in the database. This helps in managing user permissions and access levels within the system.  
POST - /register-user-role
- user-role APi: The 'user-role' API retrieves information about all user roles available in the system. Users can also provide a 'roleId' to get details of a specific user role.  
GET - /user-role  
GET - /user-role/:roleId
- user-role/:roleId API: The 'user-role' API allows users to update the information of an existing user role in the database. Users need to pass the 'roleId' of the role they want to update.  
PUT - /user-role/:roleId
- user-role/:roleId API: The 'user-role' API allows users to delete an existing user role from the database. Users need to pass the 'roleId' of the role they want to delete.  
DELETE - /user-role/:roleId
#### User Scope APIs
- user-scope API: The 'user-scope' API allows administrators to create a new scope for users in the database. This scope defines the APIs and UI pages the user can access.  
POST - /user-scope
- user-role/:roleId/user-scope API: The 'user-scope' API retrieves information about user scopes based on the 'userRoleId' provided. Users can retrieve all user scopes associated with a specific 'userRoleId' or retrieve details of a specific scope by providing its 'scopeId'.  
GET - /user-role/:roleId/user-scope  
GET - /user-role/:roleId/user-scope/:scopeId
- user-role/:roleId/user-scope/:scopeId API: The 'user-scope' API allows administrators to update the details of an existing user scope in the database. Users need to provide both 'userRoleId' and 'scopeId' to specify which scope details to update.  
PUT - /user-role/:roleId/user-scope/:scopeId
- user-role/:roleId/user-scope/:scopeId API: The 'user-scope' API allows administrators to delete a user scope from the database based on the 'userRoleId' and 'scopeId' provided.  
DELETE - /user-role/:roleId/user-scope/:scopeId
#### User Setup APIs
- :userId/user-setup API: The 'user-setup' API allows users to retrieve user setup records specific to a user by 'userId'. Users can also retrieve details of a specific user setup record by providing its 'settingId'.  
GET - /:userId/user-setup  
GET - /:userId/user-setup/:settingId
- :userId/user-setup API: The 'user-setup' API allows users to update user setup records specific to a user by 'userId'. Users can update multiple records at once or update a single record by providing its 'setupId'.
PUT - /:userId/user-setup  
PUT - /:userId/user-setup/:settingId
#### User APIs
- register-user API: The 'register-user' API allows for the registration of new users in the system. This API collects necessary user information and creates a new user account.  
POST - register-user
- :userId/verify-user API: The 'verify-user' API is used to verify a user's account by checking the provided verification code. This ensures that the user has access to the email associated with their account.  
PUT - :userId/verify-user
- login-user API: The 'login-user' API is used for authenticating users and generating a session token upon successful login.  
POST - login-user
- refresh-token API: The 'refresh-token' API is used to generate a new access token using a refresh token, extending the validity period of the user's session without requiring reauthentication.  
POST - refresh-token
- user-info/:userId API: The 'user-info' API retrieves detailed information about a user based on the 'userId'.  
GET - /user-info/:userId
- user-info/:userId API: The 'user-info' API allows users to update specific details of a user profile based on the 'userId'.  
PUT - /user-info/:userId API
- user-password/:userId API: The 'user-password' API allows users to update their password by providing the old password for verification and the new password for replacement.  
PUT - /user-password/:userId
- profile-image/:userId API: The 'profile-image' API allows users to update their profile image in system.  
PUT - /profile-image/:userId
- profile-image/:userId API: The 'profile-image' API allows users to delete their profile image from system.  
DELETE - /profile-image/:userId
- deactivate-user/:userId API: The 'deactivate-user' API allows users to deactivate their user profile. When deactivated, the user account will be suspended and cannot be accessed until reactivated.  
PUT - /deactivate-user/:userId
- logout-user API: The 'logout-user' API allows users to log out from the system, invalidating their current session and access token.  
POST - /logout-user
#### Payment APIs
- register-account API: This API will be used to register user bank or investment accounts in the database. It ensures that users can add their financial accounts to the system for tracking and management purposes.  
POST - :userId/register-account
- account-info API: This API is used to retrieve information about user bank or investment accounts from the database. Users can either get details of all their accounts or a specific account by providing an account ID.  
GET - :userId/account-info  
GET - :userId/account-info/:token
- account-info API: This API is used to update details of a user's bank or investment account in the database. Users can modify account information by providing the necessary account details along with the account ID.  
PUT - :userId/account-info/:token
- deactivate-account API: This API is used to deactivate a user's bank or investment account, preventing it from being used for payments. This can be useful for users who want to temporarily disable an account without deleting it.  
PUT - :userId/deactivate-account/:token
- reactivate-account API: This API is used to reactivate a user's previously deactivated bank or investment account, allowing it to be used for payments once again.  
PUT - :userId/reactivate-account/:token
- delete-account API: This API is used to soft delete a user's bank or investment account from the system. Instead of permanently removing the account, it will be marked as deleted by setting a flag to true.  
PUT - :userId/delete-account/:token
---
**Finance Tracker** - Simplifying Financial Management for Everyone!