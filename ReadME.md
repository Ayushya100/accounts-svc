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
- sync-setup: The 'sync-setup' API checks and inserts database records for service routes, user roles, role scopes, and dashboard settings. It ensures that these configurations are up-to-date and consistent. This API helps automate the maintenance of essential system settings in the database.
POST - sync-setup
- system-setup: The 'system-setup' API retrieves the system's basic setup details required by the UI for default operations. This API provides essential configuration data to initialize and run the user interface smoothly.
GET - system-setup
---
**Finance Tracker** - Simplifying Financial Management for Everyone!