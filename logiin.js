document.addEventListener("DOMContentLoaded", function () {

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

    const ADMIN_ID = "admin";
    const ADMIN_PASSWORD = "rgpv123";


    passwordToggle.addEventListener("click", function () {

        if (adminPassword.type === "password") {
            adminPassword.type = "text";
            passwordToggle.textContent = "Hide";
        } else {
            adminPassword.type = "password";
            passwordToggle.textContent = "Show";
        }

    });


    adminId.addEventListener("input", function () {
        adminIdError.textContent = "";
        adminId.parentElement.classList.remove("input-error");
    });


    adminPassword.addEventListener("input", function () {
        passwordError.textContent = "";
        adminPassword.parentElement.classList.remove("input-error");
    });


    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const enteredId = adminId.value.trim();
        const enteredPassword = adminPassword.value.trim();

        adminIdError.textContent = "";
        passwordError.textContent = "";

        adminId.parentElement.classList.remove("input-error");
        adminPassword.parentElement.classList.remove("input-error");


        if (enteredId === "") {
            adminIdError.textContent = "Please enter your Admin ID.";
            adminId.parentElement.classList.add("input-error");
            adminId.focus();
            return;
        }


        if (enteredPassword === "") {
            passwordError.textContent = "Please enter your password.";
            adminPassword.parentElement.classList.add("input-error");
            adminPassword.focus();
            return;
        }


        if (enteredId === ADMIN_ID && enteredPassword === ADMIN_PASSWORD) {

            sessionStorage.setItem("rgpvAdminLoggedIn", "true");


            if (rememberAdmin.checked) {
                localStorage.setItem("rgpvRememberAdmin", enteredId);
            } else {
                localStorage.removeItem("rgpvRememberAdmin");
            }


            loginButton.disabled = true;
            loginButtonText.textContent = "Login Successful ✓";

            loginStatus.innerHTML = `
                <div class="status-icon">✓</div>

                <div>
                    <strong>Login Successful!</strong>
                    <p>Welcome Admin. Opening dashboard...</p>
                </div>
            `;

            loginStatus.style.display = "flex";
            loginStatus.style.background = "#eaf8f0";
            loginStatus.style.border = "1px solid #a8d9ba";
            loginStatus.style.padding = "14px 16px";
            loginStatus.style.marginTop = "16px";
            loginStatus.style.borderRadius = "9px";
            loginStatus.style.alignItems = "center";
            loginStatus.style.gap = "12px";

            setTimeout(function () {
                window.location.replace("admin.html");
            }, 1500);

        } else {

            adminIdError.textContent = "Invalid Admin ID or password.";
            passwordError.textContent = "Please check your login credentials.";

            adminId.parentElement.classList.add("input-error");
            adminPassword.parentElement.classList.add("input-error");

            adminPassword.value = "";
            adminPassword.focus();
        }

    });


    const savedAdmin = localStorage.getItem("rgpvRememberAdmin");

    if (savedAdmin) {
        adminId.value = savedAdmin;
        rememberAdmin.checked = true;
    }


    forgotPassword.addEventListener("click", function () {
        alert("Please contact the university administrator to reset the password.");
    });

});