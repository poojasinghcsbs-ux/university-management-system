# Deployment Guide

The portal has two parts that need to be deployed separately:

1. The Spring Boot API in `backend/`
2. The static frontend files in the project root

Use a managed MySQL database and any hosting service that supports Java 17 for the API. The frontend can be hosted on any static-site service.

## 1. Prepare the database

Create an empty MySQL database. Create a separate application user that has access only to this database; do not use the MySQL root account in production.

## 2. Deploy the backend

Set the backend service root directory to `backend` and use these commands:

```text
Build: ./mvnw package
Start: java -jar target/university-portal-backend-0.0.1-SNAPSHOT.jar
```

On Windows, the build command is `./mvnw.cmd package`.

Set these environment variables in the hosting dashboard. Do not put their values in GitHub.

| Variable | Purpose |
| --- | --- |
| `PORT` | Supplied automatically by many hosting platforms; defaults to `8080` locally. |
| `DB_URL` | JDBC URL for the production MySQL database. |
| `DB_USERNAME` | Production application database username. |
| `DB_PASSWORD` | Production application database password. |
| `JWT_SECRET` | A long random secret used to sign admin sessions. |
| `ADMIN_USERNAME` | Initial administrator username. |
| `ADMIN_PASSWORD` | Initial administrator password. |
| `CORS_ALLOWED_ORIGINS` | Public frontend URL, for example `https://your-site.example`. |

After deployment, open:

```text
https://your-api.example/api/health
```

It should return a JSON response with `"status": "UP"`.

## 3. Deploy the frontend

Before publishing the static files, update `api-config.js` with the live backend URL:

```javascript
window.UNIVERSITY_PORTAL_API_URL = "https://your-api.example/api";
```

Publish the project root as the static-site directory. Do not publish the `backend/application-local.properties` file.

## 4. Set the final CORS origin

After the frontend has a live URL, set `CORS_ALLOWED_ORIGINS` on the backend to that exact URL. Multiple frontend origins may be separated with commas.

Restart the backend after changing environment variables.

## 5. Final verification

- Open the public website and submit one test enquiry.
- Subscribe one test email address to the newsletter.
- Sign in to `login.html` and verify the enquiry appears in the dashboard.
- Add one notice, course, department, and placement drive; confirm each appears publicly.
- Delete only the test entries when verification is complete.
