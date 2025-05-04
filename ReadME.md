# 🧑‍💼 Accounts-svc

## 🧩 Introduction
Welcome to the GitHub repository for **Accounts SVC** - This service is responsible for managing user accounts and their information. It provides functionality for user registration, authentication, and profile management, allowing users to securely manage their operations.

## 📌 Project Status: Under Development
### What's Happening Now:
- The service is currently being developed to create the functionalities to register and manage user accounts related information.

## 🚀 Features
### Overview
Our system provides essential APIs designed specifically for integration within our application. These APIs facilitate secure user authentication, profile management, role-based access control, and dynamic system configuration.
### Key Features
- **User Management:** Register, verify, login, and manage user profiles securely. Update user details, passwords, and manage session lifecycles with ease.
- **Role-Based Access Control:** Define and manage user roles with specific scopes to control access to system resources and functionalities.
- **System Configuration:** Set up and synchronize service routes, dashboard settings, and other system configurations dynamically.
- **Customizable User Settings:** Allow users to personalize their experience with customizable settings tailored to their preferences.
- **Profile Management:** Upload, update, and delete user profile images, enhancing user interaction and personalization.
### Usage
Our APIs are integrated seamlessly into our application to enhance user management, security, and operational efficiency.
### Security
Robust security measures are integrated in our application. Implemented HTTPS encryption for secure data transmission and added validation for JWT bearer tokens to authenticate and authorize user access. Protected sensitive financial information and adhere to industry best practices for data security and privacy.

## API Endpoints
### Public APIs
| Method | Endpoint                                               | Description                             |
| :----- | :----------------------------------------------------- | :-------------------------------------- |
| GET    | `/accounts-svc/api/v1.0/health`                        | Health Check Service                    |
| POST   | `/accounts-svc/api/v1.0/register-user`                 | Register a new user                     |
| GET    | `/accounts-svc/api/v1.0/verify-user/:userId/:token`    | Verify user email                       |
| POST   | `/accounts-svc/api/v1.0/login`                         | Log in a user                           |
| POST   | `/accounts-svc/api/v1.0/refresh-token`                 | Refresh user token                      |
| POST   | `/accounts-svc/api/v1.0/request-reset`                 | Password reset request mail             |
| POST   | `/accounts-svc/api/v1.0/reset-password/:userId`        | Reset user password                     |

### User APIs
| Method | Endpoint                                               | Description                             |
| :----- | :----------------------------------------------------- | :-------------------------------------- |
| GET    | `/accounts-svc/api/v1.0/user/:userId`                  | Get Logged in user info                 |
| POST   | `/accounts-svc/api/v1.0/user/logout`                   | Logout a user                           |
| PUT    | `/accounts-svc/api/v1.0/user/:userId`                  | Update logged in user info              |
| PUT    | `/accounts-svc/api/v1.0/user/profile-img/:userId`      | Update user profile image               |
| PUT    | `/accounts-svc/api/v1.0/user-password/:userId`         | Update user password on login           |
| DELETE | `/accounts-svc/api/v1.0/user/profile-img/:userId`      | Delete user profile image               |
| DELETE | `/accounts-svc/api/v1.0/user/deactivate-user/:userId`  | Deactivate user profile                 |

### User Role APIs
| Method | Endpoint                                               | Description                             |
| :----- | :----------------------------------------------------- | :-------------------------------------- |
| POST   | `/accounts-svc/api/v1.0/setup/user-role`               | Register new user role                  |
| GET    | `/accounts-svc/api/v1.0/setup/user-role`               | Get all user roles                      |
| GET    | `/accounts-svc/api/v1.0/setup/user-role/:roleId`       | Get user role by id                     |
| PUT    | `/accounts-svc/api/v1.0/setup/user-role/:roleId`       | Update user role by id                  |
| DELETE | `/accounts-svc/api/v1.0/setup/user-role/:roleId`       | Delete user role by id                  |

### User Scope APIs
| Method | Endpoint                                               | Description                             |
| :----- | :----------------------------------------------------- | :-------------------------------------- |
| POST   | `/accounts-svc/api/v1.0/setup/user-scope`              | Register new user scope                 |
| GET    | `/accounts-svc/api/v1.0/setup/user-scope`              | Get all user scopes                     |
| GET    | `/accounts-svc/api/v1.0/setup/user-scope/:scopeId`     | Get user scope by id                    |
| PUT    | `/accounts-svc/api/v1.0/setup/user-scope/:scopeId`     | Update user scope by id                 |
| DELETE | `/accounts-svc/api/v1.0/setup/user-scope/:scopeId`     | Delete user scope by id                 |
| GET    | `/accounts-svc/api/v1.0/setup/assigned-scope/:roleId`  | Get all assigned scopes for user role   |
| GET    | `/accounts-svc/api/v1.0/setup/unassigned-scope/:roleId`| Get all unassigned scopes for user role |
| PUT    | `/accounts-svc/api/v1.0/setup/assigned-scope/:roleId`  | Assign scopes to user role              |


## 🛠️ Setup Instructions

```bash
# Clone the repository
git clone https://github.com/Ayushya100/accounts-svc.git
cd accounts-svc

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Then configure your .env file

# Run the server
npm run start
```

## 📦 Tech Stack
- **Language:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Auth:** JWT
- **Validation:** OpenAPI Spec
- **Query Builder:** Knex.js
- **Environment Management:** dotenv
---
**Accounts-svc** - Simplifying Management for Everyone!