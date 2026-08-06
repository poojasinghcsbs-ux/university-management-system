# Railway Deployment Guide

This project is deployed as one full-stack Railway service. Spring Boot serves the website files and REST API from the same domain, while Railway MySQL stores the portal data.

## Services

- `university-management-system` - Spring Boot application and frontend files
- `MySQL` - managed database

## Deploy from GitHub

1. Create a Railway project and choose **Deploy from GitHub repo**.
2. Select the `university-management-system` repository.
3. Add a MySQL database service from the Railway project dashboard.
4. Railway detects the root `Dockerfile` and builds the Java application with Maven.
5. Generate a public Railway domain after the deployment succeeds.

## Environment variables

Set the following variables on the application service. Values must be added only in Railway, never in GitHub.

| Variable | Value or purpose |
| --- | --- |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}` |
| `SPRING_DATASOURCE_USERNAME` | `${{MySQL.MYSQLUSER}}` |
| `SPRING_DATASOURCE_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` |
| `ADMIN_USERNAME` | Administrator username, usually `admin` |
| `ADMIN_PASSWORD` | A strong private administrator password |
| `JWT_SECRET` | A long, unique private value used to sign admin sessions |
| `PORT` | Supplied automatically by Railway |

The project also supports `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` as environment-based datasource configuration alternatives.

## Architecture

```text
Visitor browser
       |
       v
Railway public domain
       |
       +-- Frontend pages and JavaScript
       +-- Spring Boot REST API
       +-- Railway MySQL database
```

Because the frontend and API use the same Railway domain, production API requests automatically use `/api` and do not need a separate frontend host or CORS configuration.

## Verification checklist

After deployment, verify the following URLs:

- `/` opens the public portal.
- `/api/health` returns `status: UP`.
- `/login.html` opens the administrator login page.
- `/admin.html` loads after successful login.
- A test enquiry and newsletter subscription appear in the admin dashboard.
- A notice, course, department, or placement drive created in the admin dashboard appears on the public website.

## Security

- Keep Railway environment variables private.
- Do not commit `backend/application-local.properties`, `.env`, passwords, database URLs containing credentials, or JWT secrets.
- Change the admin password if it is ever shared or exposed.
- Only use clearly labelled demo content on the public project unless the information is verified and approved.
