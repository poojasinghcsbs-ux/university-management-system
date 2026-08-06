const universityPortalIsLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);

window.UNIVERSITY_PORTAL_API_URL =
    window.UNIVERSITY_PORTAL_API_URL ||
    (universityPortalIsLocal
        ? "http://localhost:8080/api"
        : `${window.location.origin}/api`);
