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
Robust security measures are integrated in our application. Implemented HTTPS encryption for secure data transmission and added validation for JWT bearer tokens to authenticate and authorize user access. Protected sensitive information and adhere to industry best practices for data security and privacy.

## API Endpoints
### Public APIs
| Method | Endpoint                                                | Description                             |
| :----- | :------------------------------------------------------ | :-------------------------------------- |
| GET    | `/accounts-svc/api/v1.0/health`                         | Health Check Service                    |
| POST   | `/accounts-svc/api/v1.0/register-user`                  | Register a new user                     |
| GET    | `/accounts-svc/api/v1.0/verify-user/:userId/:token`     | Verify user email                       |
| POST   | `/accounts-svc/api/v1.0/login`                          | Log in a user                           |
| POST   | `/accounts-svc/api/v1.0/refresh-token`                  | Refresh user token                      |
| POST   | `/accounts-svc/api/v1.0/request-reset`                  | Password reset request mail             |
| POST   | `/accounts-svc/api/v1.0/reset-password/:userId`         | Reset user password                     |

### User APIs
| Method | Endpoint                                                | Description                             |
| :----- | :------------------------------------------------------ | :-------------------------------------- |
| GET    | `/accounts-svc/api/v1.0/user/:userId`                   | Get Logged in user info                 |
| POST   | `/accounts-svc/api/v1.0/user/logout`                    | Logout a user                           |
| PUT    | `/accounts-svc/api/v1.0/user/:userId`                   | Update logged in user info              |
| PUT    | `/accounts-svc/api/v1.0/user/profile-img/:userId`       | Update user profile image               |
| PUT    | `/accounts-svc/api/v1.0/user/password/:userId`          | Update user password on login           |
| DELETE | `/accounts-svc/api/v1.0/user/profile-img/:userId`       | Delete user profile image               |
| DELETE | `/accounts-svc/api/v1.0/user/deactivate-user/:userId`   | Deactivate user profile                 |

### User Role APIs
| Method | Endpoint                                                | Description                             |
| :----- | :------------------------------------------------------ | :-------------------------------------- |
| POST   | `/accounts-svc/api/v1.0/setup/role`                     | Register new user role                  |
| GET    | `/accounts-svc/api/v1.0/setup/role`                     | Get all user roles                      |
| GET    | `/accounts-svc/api/v1.0/setup/role/:roleId`             | Get user role by id                     |
| PUT    | `/accounts-svc/api/v1.0/setup/role/:roleId`             | Update user role by id                  |
| DELETE | `/accounts-svc/api/v1.0/setup/role/:roleId`             | Delete user role by id                  |

### User Scope APIs
| Method | Endpoint                                                | Description                             |
| :----- | :------------------------------------------------------ | :-------------------------------------- |
| POST   | `/accounts-svc/api/v1.0/setup/scope`                    | Register new user scope                 |
| GET    | `/accounts-svc/api/v1.0/setup/scope`                    | Get all user scopes                     |
| GET    | `/accounts-svc/api/v1.0/setup/scope/:scopeId`           | Get user scope by id                    |
| PUT    | `/accounts-svc/api/v1.0/setup/scope/:scopeId`           | Update user scope by id                 |
| DELETE | `/accounts-svc/api/v1.0/setup/scope/:scopeId`           | Delete user scope by id                 |
| GET    | `/accounts-svc/api/v1.0/setup/scope/assigned/:roleId`   | Get all assigned scopes for user role   |
| GET    | `/accounts-svc/api/v1.0/setup/scope/unassigned/:roleId` | Get all unassigned scopes for user role |
| PUT    | `/accounts-svc/api/v1.0/setup/scope/assigned/:roleId`   | Assign scopes to user role              |

### Service Registration APIs
| Method | Endpoint                                                | Description                             |
| :----- | :------------------------------------------------------ | :-------------------------------------- |
| POST   | `/accounts-svc/api/v1.0/setup/service`                  | Register new service in db              |
| GET    | `/accounts-svc/api/v1.0/setup/service`                  | Get all registered services             |
| GET    | `/accounts-svc/api/v1.0/setup/service/:svcId`           | Get registered service by id            |
| PUT    | `/accounts-svc/api/v1.0/setup/service/:svcId`           | Update service info by id               |
| DELETE | `/accounts-svc/api/v1.0/setup/service/:svcId`           | Delete service for provided id          |

### Route Registration APIs
| Method | Endpoint                                                | Description                             |
| :----- | :------------------------------------------------------ | :-------------------------------------- |
| POST   | `/accounts-svc/api/v1.0/setup/route`                    | Register new route in db                |
| GET    | `/accounts-svc/api/v1.0/setup/route`                    | Get all registered routes               |
| GET    | `/accounts-svc/api/v1.0/setup/route/:routeId`           | Get registered route by id              |
| PUT    | `/accounts-svc/api/v1.0/setup/route/:routeId`           | Update route info by id                 |
| DELETE | `/accounts-svc/api/v1.0/setup/route/:routeId`           | Delete route for provided id            |

### Dashboard Header APIs
| Method | Endpoint                                                | Description                             |
| :----- | :------------------------------------------------------ | :-------------------------------------- |
| POST   | `/accounts-svc/api/v1.0/dashboard/header`               | Register new dashboard header in db     |
| GET    | `/accounts-svc/api/v1.0/dashboard/header`               | Get all registered headers              |
| GET    | `/accounts-svc/api/v1.0/dashboard/header/:headerId`     | Get registered header by id             |
| PUT    | `/accounts-svc/api/v1.0/dashboard/header/:headerId`     | Update header info by id                |
| DELETE | `/accounts-svc/api/v1.0/dashboard/header/:headerId`     | Delete header for provided id           |

### Dashboard Category APIs
| Method | Endpoint                                                | Description                             |
| :----- | :------------------------------------------------------ | :-------------------------------------- |
| POST   | `/accounts-svc/api/v1.0/dashboard/category`             | Register new dashboard category in db   |
| GET    | `/accounts-svc/api/v1.0/dashboard/category`             | Get all registered categories           |
| GET    | `/accounts-svc/api/v1.0/dashboard/category/:categoryId` | Get registered category by id           |
| PUT    | `/accounts-svc/api/v1.0/dashboard/category/:categoryId` | Update category info by id              |
| DELETE | `/accounts-svc/api/v1.0/dashboard/category/:categoryId` | Delete category for provided id         |

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