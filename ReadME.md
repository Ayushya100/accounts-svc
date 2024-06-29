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
- register-account API: This API will be used to register user bank or investment accounts in the database. It ensures that users can add their financial accounts to the system for tracking and management purposes. Below is a list of account types that can be created, along with a brief description of each account.  
**SAVINGS:** A bank account that allows users to save money while earning interest. It's usually linked to a debit card.  
**CURRENT:** A bank account primarily used for business transactions with no limit on the number of transactions.  
**SALARY:** A bank account specifically designed for salaried employees to receive their monthly salary.  
**RECURRING:** An account where users can deposit a fixed amount of money at regular intervals, typically earning higher interest than a savings account.  
**FIXED_DEPOSIT:** An investment account where a lump sum amount is deposited for a fixed tenure with a fixed interest rate.  
**NRI:** Non-Resident Indian accounts designed for Indians residing abroad, allowing them to manage their income earned in India.  
**DEMAT:** An account to hold financial securities (equity or debt) in electronic form.  
**EPF:** Employees' Provident Fund account where both employer and employee contribute for the employee's retirement savings.  
**PPF:** Public Provident Fund account offering tax benefits and long-term savings with a fixed interest rate.  
**NPS:** National Pension System account designed for long-term retirement savings with tax benefits.  
**MUTUAL_FUNDS:** An account to manage investments in various mutual fund schemes.  
**GOLD_SAVINGS:** An account for investing in gold savings schemes, typically offered by banks and financial institutions.  
**GOVT_BONDS:** An account for investing in government bonds, which are considered a secure investment option.  
**HEALTH_SAVINGS:** A health savings account (HSA) used to save for medical expenses with tax benefits.  
**INSURANCE:** An account to manage various insurance policies, including life, health, and general insurance.  
POST - :userId/register-account
- account-info API: This API is used to retrieve information about user bank or investment accounts from the database. Users can either get details of all their accounts or a specific account by providing an account ID.  
GET - :userId/account-info  
GET - :userId/account-info/:token
- account-info API: This API is used to update details of a user's bank or investment account in the database. Users can modify account information by providing the necessary account details along with the account ID.  
PUT - :userId/account-info/:token
- deactivate-account API: This API is used to deactivate a user's bank or investment account, preventing it from being used for payments. This can be useful for users who want to temporarily disable an account without deleting it.  
PUT - :userId/deactivate-account/:token
- activate-account API: This API is used to reactivate a user's previously deactivated bank or investment account, allowing it to be used for payments once again.  
PUT - :userId/activate-account/:token
- delete-account API: This API is used to soft delete a user's bank or investment account from the system. Instead of permanently removing the account, it will be marked as deleted by setting a flag to true.  
PUT - :userId/delete-account/:token
- register-payment API: The 'register-payment' API allows users to register new payment options in the system. This API supports a variety of payment methods, including cash, wallet, UPI, mobile banking, internet banking, cheque, and demand draft.  
**CASH:** Physical currency used for transactions. Not linked to a bank account.  
**UPI:** Unified Payments Interface, a real-time payment system allowing instant transfer of money between bank accounts through a mobile device. Linked to a bank account.  
**WALLET:** Digital wallets that store funds and can be used for online transactions. Examples include Paytm, Google Pay, etc. Not necessarily linked to a bank account but can be funded from one.  
**INTERNET-BANKING:** Online banking services that allow users to conduct financial transactions via the internet. Linked to a bank account.  
**MOBILE-BANKING:** Banking services provided via a mobile application. Linked to a bank account.  
**CHEQUE:** A written, dated, and signed instrument that directs a bank to pay a specific amount of money to the bearer. Linked to a bank account.  
**DEMAND-DRAFT:** A prepaid negotiable instrument used for transferring money from one bank account to another. Linked to a bank account.  
POST - :userId/register-payment
- payment-account-info API: The 'payment-account-info' API allows users to retrieve their payment account information. Users can either retrieve all of their payment accounts, specific account information by passing its token, or get account details by payment category.  
GET - :userId/payment-account-info  
GET - :userId/payment-account-info/:token  
GET - :userId/payment-account-info/type/:paymentType
- payment-account-info API: The 'payment-account-info' API allows users to update the payment account information for a specified account. Users are only allowed to update the payment account number.  
PUT - :userId/payment-account-info/:token
- deactivate-payment-account API: The 'deactivate-payment-account' API allows users to deactivate a specific payment mode account, making it unavailable for future transactions.  
PUT - :userId/deactivate-payment-account/:token
- activate-payment-account API: The 'activate-payment-account' API allows users to reactivate a specific payment mode account, making it available for future transactions.  
PUT - :userId/activate-payment-account/:token
- delete-payment-account API: The delete-payment-account API allows users to soft delete a specific payment account in the system. A soft delete means the account will be marked as deleted and won't be available for transactions, but it will not be permanently removed from the database.  
PUT - :userId/delete-payment-account/:token
- register-card API: The 'register-card' API allows users to create a new card in the system. Below is a list of card types that can be created, along with a brief description of each card and whether they are linked to an account.  
**CREDIT:** A card that allows users to borrow money up to a certain limit for purchases, with the obligation to repay with interest. Linked to an account.  
**DEBIT:** A card that deducts money directly from a user's checking account to pay for purchases. Linked to an account.  
**PREPAID:** A card that is preloaded with funds and used until the balance is exhausted. Not linked to an account.  
**MEAL:** A card provided by employers to employees for purchasing meals. Not linked to an account.  
**RESTAURANT:** A card specifically for use at restaurants. Not linked to an account.  
**PUBLIC_TRANSIT:** A card for use in public transportation systems. Not linked to an account.  
**TRAVEL:** A card for use in booking travel-related services such as flights and hotels. Not linked to an account.  
**GIFT:** A card preloaded with a specific amount of money, often given as a gift. Not linked to an account.  
**STORE_CREDIT:** A card issued by a store, allowing the holder to purchase goods and services from that store. Linked to an account.  
**CORPORATE_CREDIT:** A credit card issued to employees for business expenses. Linked to a corporate account.  
**PROCUREMENT:** A card used by businesses to purchase goods and services. Linked to a business account.  
**HEALTH_SAVINGS:** A card linked to a health savings account (HSA) for medical expenses. Linked to an HSA account.  
**INSURANCE:** A card provided by an insurance company for managing and paying insurance-related expenses. Linked to an insurance account.  
**FUEL:** A card used to pay for fuel expenses. Not linked to an account.  
**CAMPUS:** A card used within a campus for various services, such as dining, bookstore purchases, and access to facilities. Not linked to a campus account.  
POST - :userId/register-card
- card-info API: The 'card-info' API allows users to retrieve information about their cards. Users can retrieve information for all their cards, for a specific card by card token, or for a specific type of cards.  
GET - :userId/card-info  
GET - :userId/card-info/:token  
GET - :userId/card-info/type/:cardType
---
**Finance Tracker** - Simplifying Financial Management for Everyone!