# University Portal Backend

Spring Boot REST API for the RGPV University Portal.

## Responsibilities

- Administrator authentication with JWT tokens
- Enquiry creation and management
- Newsletter subscription management
- Dashboard summary data
- MySQL persistence through Spring Data JPA

## Local Setup

1. Create a MySQL database named `university_management_system`.
2. Create an application database user with access only to that database.
3. Create `application-local.properties` in this folder:

```properties
spring.datasource.username=your_mysql_app_username
spring.datasource.password=your_mysql_app_password
app.admin.password=your_admin_login_password
app.jwt.secret=use_a_long_random_secret_here
```

4. Start the API:

```powershell
.\mvnw.cmd spring-boot:run
```

The API is available at `http://localhost:8080/api`.

## Health Check

```text
GET http://localhost:8080/api/health
```

## Important

`application-local.properties` is intentionally ignored by Git. Keep all passwords and secrets in that file or in environment variables.
