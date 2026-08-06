const portalIsLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const portalDefaultApiUrl = portalIsLocal
    ? (window.UNIVERSITY_PORTAL_API_URL || "http://localhost:8080/api")
    : "/api";
const API_BASE_URL = portalDefaultApiUrl
    .replace(/\/$/, "");

function initializeLogin() {
    const loginForm = document.getElementById("loginForm");
    const adminId = document.getElementById("adminId");
    const adminPassword = document.getElementById("adminPassword");
    const adminIdError = document.getElementById("adminIdError");
    const passwordError = document.getElementById("passwordError");
    const passwordToggle = document.getElementById("passwordToggle");
    const rememberAdmin = document.getElementById("rememberAdmin");
    const loginButton = document.getElementById("loginButton");
    const loginButtonText = document.getElementById("loginButtonText");
    const loginStatus = document.getElementById("loginStatus");
    const forgotPassword = document.getElementById("forgotPassword");

    if (!loginForm || !adminId || !adminPassword) {
        return;
    }

    passwordToggle?.addEventListener("click", () => {
        const isPasswordVisible = adminPassword.type === "text";
        adminPassword.type = isPasswordVisible ? "password" : "text";
        passwordToggle.textContent = isPasswordVisible ? "Show" : "Hide";
    });

    adminId.addEventListener("input", () => clearInputError(adminId, adminIdError));
    adminPassword.addEventListener("input", () => clearInputError(adminPassword, passwordError));

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = adminId.value.trim();
        const password = adminPassword.value;
        clearInputError(adminId, adminIdError);
        clearInputError(adminPassword, passwordError);

        if (!username) {
            showInputError(adminId, adminIdError, "Please enter your Admin ID.");
            adminId.focus();
            return;
        }

        if (!password) {
            showInputError(adminPassword, passwordError, "Please enter your password.");
            adminPassword.focus();
            return;
        }

        setLoginLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || "Invalid Admin ID or password.");
            }

            sessionStorage.setItem("rgpvAdminToken", data.token);
            sessionStorage.setItem("rgpvAdminLoggedIn", "true");

            if (rememberAdmin?.checked) {
                localStorage.setItem("rgpvRememberAdmin", username);
            } else {
                localStorage.removeItem("rgpvRememberAdmin");
            }

            showLoginSuccess(loginStatus);
            setTimeout(() => window.location.replace("admin.html"), 1000);
        } catch (error) {
            showInputError(adminId, adminIdError, error.message || "Unable to sign in.");
            showInputError(adminPassword, passwordError, "Please check your login details.");
            adminPassword.value = "";
            adminPassword.focus();
            setLoginLoading(false);
        }
    });

    const savedAdmin = localStorage.getItem("rgpvRememberAdmin");
    if (savedAdmin && rememberAdmin) {
        adminId.value = savedAdmin;
        rememberAdmin.checked = true;
    }

    forgotPassword?.addEventListener("click", () => {
        alert("Please contact the university administrator to reset the admin password.");
    });

    function setLoginLoading(isLoading) {
        if (loginButton) {
            loginButton.disabled = isLoading;
        }
        if (loginButtonText) {
            loginButtonText.textContent = isLoading ? "Signing in..." : "Login";
        }
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeLogin);
} else {
    initializeLogin();
}

function clearInputError(input, errorElement) {
    input.parentElement?.classList.remove("input-error");
    if (errorElement) {
        errorElement.textContent = "";
    }
}

function showInputError(input, errorElement, message) {
    input.parentElement?.classList.add("input-error");
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function showLoginSuccess(loginStatus) {
    if (!loginStatus) {
        return;
    }
    loginStatus.innerHTML = `
        <div class="status-icon">✓</div>
        <div>
            <strong>Login Successful!</strong>
            <p>Opening dashboard...</p>
        </div>`;
    loginStatus.style.display = "flex";
    loginStatus.style.background = "#eaf8f0";
    loginStatus.style.border = "1px solid #a8d9ba";
    loginStatus.style.padding = "14px 16px";
    loginStatus.style.marginTop = "16px";
    loginStatus.style.borderRadius = "9px";
    loginStatus.style.alignItems = "center";
    loginStatus.style.gap = "12px";
}
