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