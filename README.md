
<a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>

# Portfolio API - NestJS

## 📚 Project Overview
This is a **Portfolio API** built with **NestJS** using a **Modular Monolithic Architecture**. The API manages user authentication, project creation with categories and programming languages, and image uploads.

## 🏗️ Architecture Pattern: Modular Monolithic

### Why Modular Monolithic?
- **Modular**: Each feature (authentication, project, user, image) is organized into its own module, making the project scalable and maintainable.
- **Monolithic**: All modules are integrated into a single application for simplicity and performance.

### Folder Structure
```
src/
├── auth/            # Authentication (login, register, JWT)
├── common/          # Helpers, middleware, and utilities
├── config           # Configuration
├── image/           # Image serving endpoint
├── prisma/          # Prisma ORM configuration
├── project/         # CRUD for projects, type, and languages
├── user/            # User management (password update, user logs)
├── app.module.ts    # Main module
├── main.ts          # Application entry point
storage/
├── logs/            # Server Log
└── media/           # Uploaded images
test/
└── app.e2e-spec.ts  # E2E testing for authentication and user logs
```

## 🔑 Features
- **User Authentication** with JWT (Login & Register)
- **CRUD Project** with automatic type and language management
- **Image Upload** with a 2MB limit, stored in `storage/media`
- **User Logs** for actions like create, update, and delete (excluding read)
- **Filtering and Pagination** for project retrieval
- **Global Exception Handling** for consistent API responses
- **E2E Testing** for critical authentication flows

## 📄 API Documentation

Complete API documentation is available on **Postman**:

🔗 [Postman Documentation](https://documenter.getpostman.com/view/26168270/2sAYQWKZ7U)

## 🚀 Running the Project

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Database Migrations**
   ```bash
   npx prisma migrate dev
   ```

3. **Start the Server**
   ```bash
   npm run start:dev
   ```

4. **Run E2E Tests**
   ```bash
   npm run test:e2e
   ```

## 🔧 Technologies Used
- **NestJS** - Node.js framework for scalable server-side apps
- **Prisma ORM** - Database management
- **JWT** - Authentication token
- **Multer** - Image upload handling
- **Supertest** - E2E testing

## 📂 Project Modules Breakdown

### `auth/`
Handles user registration, login, and JWT-based authentication.

### `project/`
Manages projects with automatic type and language creation if they don't exist.

### `image/`
Serves uploaded images via `/image/:fileName` route.

### `user/`
Handles password updates and logs user actions.

### `common/`
Utility functions, middleware (logger), and global exception handling.

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
