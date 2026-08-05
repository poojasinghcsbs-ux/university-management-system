# RGPV University Portal

A full-stack university portal that brings together campus information, enquiry handling, newsletter subscriptions, and an administrator dashboard in one responsive web application.

The project is designed as a practical university management portal. Visitors can explore academic and campus information, while administrators can sign in to view and manage data stored in MySQL.

## Features

### Public website

- Responsive university landing page
- Programmes, departments, admissions, notices, placements, and campus highlights
- Student enquiry form with client-side validation
- Newsletter subscription interface
- Latest Notices, Programmes, Departments, and Placement Drives powered by backend APIs
- Responsive navigation and interactive page sections

### Administration portal

- Secure administrator login backed by a Spring Boot API
- Token-based session for protected admin requests
- Dashboard statistics for enquiries and subscribers
- Search, view, update status, and delete enquiries
- View and delete newsletter subscribers
- Create, edit, and delete university notices
- Create, edit, and delete university courses
- Create, edit, and delete academic departments
- Create, edit, and delete placement drives
- Database-driven records instead of browser-only storage

### Backend API

- REST APIs for enquiries, newsletter subscriptions, notices, courses, departments, and placement drives
- MySQL persistence with Spring Data JPA
- Centralised validation and error responses
- BCrypt password hashing for the configured administrator account
- JWT authentication for admin-only endpoints
- CORS configuration for local frontend development

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Java, Spring Boot, Spring Data JPA, Maven |
| Database | MySQL |
| Security | JWT, BCrypt |
| Tools | VS Code, MySQL Workbench, Git, GitHub |

## Project Structure

```text
collage-website/
|
|-- indexxx.html                 # Main website
|-- styleee.css                  # Main website styling
|-- script.js                    # Public website interactions
|-- login.html                   # Admin login page
|-- login.css
|-- logiin.js                    # API-based admin login
|-- admin.html                   # Admin dashboard
|-- admin.css
|-- admin.js                     # Dashboard API integration
|-- api-config.js                # Frontend API base URL configuration
|-- DEPLOYMENT.md                # Production deployment steps
|-- images/
|
|-- backend/
|   |-- src/main/java/           # Spring Boot source code
|   |-- src/main/resources/
|   |-- pom.xml
|   |-- mvnw.cmd
|   |-- .env.example
|   `-- README.md
|
`-- README.md
```

## API Overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Check whether the backend is running |
| POST | `/api/enquiries` | Save a student enquiry |
| POST | `/api/newsletter` | Save a newsletter subscription |
| GET | `/api/notices` | Get latest notices for the public website |
| GET | `/api/courses` | Get courses for the public website |
| GET | `/api/departments` | Get departments for the public website |
| GET | `/api/placements` | Get placement drives for the public website |
| POST | `/api/auth/login` | Admin login and token generation |
| GET | `/api/admin/dashboard` | Get admin dashboard counts |
| GET | `/api/admin/enquiries` | List or search enquiries |
| PATCH | `/api/admin/enquiries/{id}/status` | Update an enquiry status |
| DELETE | `/api/admin/enquiries/{id}` | Delete an enquiry |
| GET | `/api/admin/subscribers` | List newsletter subscribers |
| DELETE | `/api/admin/subscribers/{id}` | Delete a subscriber |
| GET | `/api/admin/notices` | List notices for the admin dashboard |
| POST | `/api/admin/notices` | Create a notice |
| PUT | `/api/admin/notices/{id}` | Edit a notice |
| DELETE | `/api/admin/notices/{id}` | Delete a notice |
| GET | `/api/admin/courses` | List courses for the admin dashboard |
| POST | `/api/admin/courses` | Create a course |
| PUT | `/api/admin/courses/{id}` | Edit a course |
| DELETE | `/api/admin/courses/{id}` | Delete a course |
| GET | `/api/admin/departments` | List departments for the admin dashboard |
| POST | `/api/admin/departments` | Create a department |
| PUT | `/api/admin/departments/{id}` | Edit a department |
| DELETE | `/api/admin/departments/{id}` | Delete a department |
| GET | `/api/admin/placements` | List placement drives for the admin dashboard |
| POST | `/api/admin/placements` | Create a placement drive |
| PUT | `/api/admin/placements/{id}` | Edit a placement drive |
| DELETE | `/api/admin/placements/{id}` | Delete a placement drive |

Admin API routes require a valid token returned by the login endpoint.

## Run Locally

### Prerequisites

- Java 17 or later
- MySQL Server 8 or later
- MySQL Workbench (recommended)
- A modern web browser

### 1. Create the database

Run this in MySQL Workbench:

```sql
CREATE DATABASE university_management_system;
```

Create a MySQL user for the application and grant it access to this database. Avoid using the MySQL root account in the project configuration.

### 2. Configure local secrets

Create `backend/application-local.properties`. This file is ignored by Git and must stay private.

```properties
spring.datasource.username=your_mysql_app_username
spring.datasource.password=your_mysql_app_password
app.admin.password=your_admin_login_password
app.jwt.secret=use_a_long_random_secret_here
```

The database URL, port, and other safe defaults are available in `backend/src/main/resources/application.properties`.

### 3. Start the backend

From the `backend` folder, run:

```powershell
.\mvnw.cmd spring-boot:run
```

The API starts at `http://localhost:8080/api`. You can verify it by opening:

```text
http://localhost:8080/api/health
```

### 4. Open the frontend

Open `indexxx.html` with Live Server in VS Code, or run it through any local static server. Keep the backend running while using the administration portal.

## Deployment

The portal is ready for separate frontend and backend deployment. Follow [DEPLOYMENT.md](DEPLOYMENT.md) to configure production environment variables, CORS, the public API URL, and final verification.

## Security Notes

- `backend/application-local.properties` and `.env` are excluded from version control.
- Never commit database passwords, admin passwords, or JWT secrets.
- `JWT_SECRET` is required before the API starts; production CORS origins are configured with `CORS_ALLOWED_ORIGINS`.
- The backend stores the configured admin password as a BCrypt hash.
- Admin data APIs require a JWT token and reject unauthorised requests.

## Current Status

The portal has a complete responsive frontend and a working Spring Boot + MySQL backend for authentication, enquiries, newsletter data, notices, courses, departments, placement drives, and dashboard management. The public contact and newsletter forms are connected to the REST API, so submitted data is stored in MySQL and available in the admin dashboard. Administrators can search, view, delete, and update enquiry status, as well as publish, edit, and delete notices, courses, departments, and placement drives. Published notices, courses, departments, and placement drives appear automatically in the public website. The next enhancement is preparing a production deployment configuration.

## Future Enhancements

- Role-based access for multiple administrators
- Email confirmations for enquiries and newsletter subscriptions
- Deployment with environment-based production configuration

## Project Demo

[Watch the frontend walkthrough](university-management-system-demo-compressed.mp4)
