
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* ==========================================
       CONFIGURATION
    ========================================== */

    const USERS_KEY = "nplAuthUsers";
    const SESSION_KEY = "nplAuthSession";
    const REMEMBER_KEY = "nplAuthRememberedEmail";

    const loginForm = document.getElementById("nplAuthLoginForm");
    const signupForm = document.getElementById("nplAuthSignupForm");
    const loginTab = document.getElementById("nplAuthLoginTab");
    const signupTab = document.getElementById("nplAuthSignupTab");
    const heading = document.getElementById("nplAuthHeading");
    const description = document.getElementById("nplAuthDescription");
    const status = document.getElementById("nplAuthStatus");
    const rememberCheckbox = document.getElementById("nplAuthRemember");
    const forgotButton = document.getElementById("nplAuthForgotPassword");

    if (!loginForm || !signupForm || !status) {
        console.error("Login/signup form elements were not found.");
        return;
    }

    /* ==========================================
       STATUS MESSAGES
    ========================================== */

    function showStatus(message, type) {
        status.textContent = message;
        status.className = "npl-auth-status";

        if (message) {
            status.classList.add("is-visible");
        }

        if (type) {
            status.classList.add("is-" + type);
        }
    }

    function clearStatus() {
        showStatus("", "");
    }

    /* ==========================================
       LOCAL STORAGE HELPERS
    ========================================== */

    function getUsers() {
        try {
            const users = JSON.parse(
                localStorage.getItem(USERS_KEY) || "[]"
            );

            return Array.isArray(users) ? users : [];
        } catch (error) {
            return [];
        }
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    /* ==========================================
       FIELD VALIDATION
    ========================================== */

    function setFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);

        const errorElement = document.querySelector(
            '[data-error-for="' + fieldId + '"]'
        );

        if (errorElement) {
            errorElement.textContent = message || "";
        }

        if (field) {
            field.classList.toggle("is-invalid", Boolean(message));
            field.setAttribute(
                "aria-invalid",
                message ? "true" : "false"
            );
        }
    }

    function setRoleError(dropdown, message) {
        if (!dropdown) return;

        const errorElement = dropdown.parentElement.querySelector(
            "[data-role-error]"
        );

        if (errorElement) {
            errorElement.textContent = message || "";
        }

        dropdown.classList.toggle("is-invalid", Boolean(message));
        dropdown.setAttribute(
            "aria-invalid",
            message ? "true" : "false"
        );
    }

    function clearFormErrors(form) {
        form.querySelectorAll("[data-error-for]").forEach(function (item) {
            item.textContent = "";
        });

        form.querySelectorAll("[data-role-error]").forEach(function (item) {
            item.textContent = "";
        });

        form.querySelectorAll(".is-invalid").forEach(function (item) {
            item.classList.remove("is-invalid");
            item.setAttribute("aria-invalid", "false");
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    }

    function isValidName(name) {
        return /^[\p{L}]+(?:[ '\u2019-][\p{L}]+)*$/u.test(name);
    }

    function validateEmail(input) {
        const email = input.value.trim();
        let message = "";

        if (!email) {
            message = "Please enter your email address.";
        } else if (!isValidEmail(email)) {
            message = "Please enter a valid email address.";
        }

        setFieldError(input.id, message);
        return !message;
    }

    function validatePassword(input, minimumLength) {
        let message = "";

        if (!input.value) {
            message = "Please enter your password.";
        } else if (input.value.length < minimumLength) {
            message = "Password must contain at least " +
                minimumLength + " characters.";
        }

        setFieldError(input.id, message);
        return !message;
    }

    /* ==========================================
       ROLE DROPDOWNS
    ========================================== */

    const roleDropdowns = Array.from(
        document.querySelectorAll("[data-role-dropdown]")
    );

    function closeRoleDropdown(dropdown) {
        if (!dropdown) return;

        const trigger = dropdown.querySelector(
            ".npl-auth-role-trigger"
        );

        const panel = dropdown.querySelector(
            ".npl-auth-role-options"
        );

        dropdown.classList.remove("is-open");

        if (trigger) {
            trigger.setAttribute("aria-expanded", "false");
        }

        if (panel) {
            panel.style.display = "none";
            panel.setAttribute("aria-hidden", "true");
        }
    }

    function closeAllRoleDropdowns(exceptDropdown) {
        roleDropdowns.forEach(function (dropdown) {
            if (dropdown !== exceptDropdown) {
                closeRoleDropdown(dropdown);
            }
        });
    }

    function openRoleDropdown(dropdown) {
        if (!dropdown) return;

        const trigger = dropdown.querySelector(
            ".npl-auth-role-trigger"
        );

        const panel = dropdown.querySelector(
            ".npl-auth-role-options"
        );

        if (!trigger || !panel) return;

        closeAllRoleDropdowns(dropdown);

        dropdown.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        panel.style.display = "block";
        panel.setAttribute("aria-hidden", "false");
    }

    function toggleRoleDropdown(dropdown) {
        if (dropdown.classList.contains("is-open")) {
            closeRoleDropdown(dropdown);
        } else {
            openRoleDropdown(dropdown);
        }
    }

    function selectRole(dropdown, role) {
        if (!dropdown || !["admin", "client"].includes(role)) {
            return;
        }

        const hiddenInput = dropdown.querySelector("[data-role-input]");

        const selectedContainer = dropdown.querySelector(
            ".npl-auth-role-selected"
        );

        if (!hiddenInput || !selectedContainer) return;

        const roleName = role === "admin" ? "Admin" : "Client";

        const iconName = role === "admin"
            ? "fa-user-shield"
            : "fa-user";

        hiddenInput.value = role;
        dropdown.dataset.roleValue = role;

        selectedContainer.replaceChildren();

        const icon = document.createElement("i");
        icon.className = "fa-solid " + iconName;
        icon.setAttribute("aria-hidden", "true");

        const label = document.createElement("span");
        label.textContent = roleName;

        selectedContainer.append(icon, label);

        dropdown.querySelectorAll("[data-role-option]").forEach(
            function (option) {
                const selected = option.dataset.roleOption === role;

                option.classList.toggle("selected", selected);
                option.setAttribute("aria-selected", String(selected));
            }
        );

        setRoleError(dropdown, "");
        closeRoleDropdown(dropdown);
    }

    function getSelectedRole(form) {
        const dropdown = form.querySelector("[data-role-dropdown]");

        if (!dropdown) return "";

        const hiddenInput = dropdown.querySelector("[data-role-input]");

        return hiddenInput ? hiddenInput.value : "";
    }

    roleDropdowns.forEach(function (dropdown) {
        const trigger = dropdown.querySelector(
            ".npl-auth-role-trigger"
        );

        const panel = dropdown.querySelector(
            ".npl-auth-role-options"
        );

        if (!trigger || !panel) {
            console.error("Check the role dropdown HTML:", dropdown);
            return;
        }

        closeRoleDropdown(dropdown);

        trigger.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            toggleRoleDropdown(dropdown);
        });

        dropdown.querySelectorAll("[data-role-option]").forEach(
            function (option) {
                option.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    selectRole(
                        dropdown,
                        option.dataset.roleOption
                    );
                });
            }
        );

        trigger.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeRoleDropdown(dropdown);
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();
                openRoleDropdown(dropdown);

                const firstOption = panel.querySelector(
                    "[data-role-option]"
                );

                if (firstOption) {
                    firstOption.focus();
                }
            }
        });

        panel.addEventListener("keydown", function (event) {
            const options = Array.from(
                panel.querySelectorAll("[data-role-option]")
            );

            const index = options.indexOf(document.activeElement);

            if (event.key === "Escape") {
                event.preventDefault();
                closeRoleDropdown(dropdown);
                trigger.focus();
            }

            if (event.key === "ArrowDown" && options.length) {
                event.preventDefault();
                options[(index + 1) % options.length].focus();
            }

            if (event.key === "ArrowUp" && options.length) {
                event.preventDefault();

                options[
                    index <= 0 ? options.length - 1 : index - 1
                ].focus();
            }
        });
    });

    document.addEventListener("click", function (event) {
        roleDropdowns.forEach(function (dropdown) {
            if (!dropdown.contains(event.target)) {
                closeRoleDropdown(dropdown);
            }
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeAllRoleDropdowns();
        }
    });

    /* ==========================================
       LOGIN / SIGNUP SWITCHING
    ========================================== */

    function switchMode(mode) {
        const isSignup = mode === "signup";

        loginForm.hidden = isSignup;
        signupForm.hidden = !isSignup;

        loginForm.classList.toggle("active", !isSignup);
        signupForm.classList.toggle("active", isSignup);

        if (loginTab && signupTab) {
            loginTab.classList.toggle("active", !isSignup);
            signupTab.classList.toggle("active", isSignup);

            loginTab.setAttribute("aria-selected", String(!isSignup));
            signupTab.setAttribute("aria-selected", String(isSignup));
        }

        if (heading) {
            heading.textContent = isSignup
                ? "Create Your Account"
                : "Welcome Back";
        }

        if (description) {
            description.textContent = isSignup
                ? "Create an account to manage your legal service requests."
                : "Sign in to access your legal service account.";
        }

        closeAllRoleDropdowns();
        clearStatus();
        clearFormErrors(loginForm);
        clearFormErrors(signupForm);
    }

    document.querySelectorAll("[data-auth-mode]").forEach(
        function (button) {
            button.addEventListener("click", function () {
                switchMode(button.dataset.authMode);
            });
        }
    );

    /* ==========================================
       SHOW / HIDE PASSWORD
    ========================================== */

    document.querySelectorAll("[data-password-toggle]").forEach(
        function (button) {
            button.addEventListener("click", function () {
                const input = document.getElementById(
                    button.dataset.passwordToggle
                );

                const icon = button.querySelector("i");

                if (!input) return;

                const showPassword = input.type === "password";

                input.type = showPassword ? "text" : "password";

                button.setAttribute(
                    "aria-pressed",
                    String(showPassword)
                );

                button.setAttribute(
                    "aria-label",
                    showPassword ? "Hide password" : "Show password"
                );

                if (icon) {
                    icon.classList.toggle("fa-eye", !showPassword);
                    icon.classList.toggle("fa-eye-slash", showPassword);
                }
            });
        }
    );

    /* ==========================================
       CLEAR ERRORS WHILE TYPING
    ========================================== */

    document.querySelectorAll(".npl-auth-form input").forEach(
        function (input) {
            input.addEventListener("input", function () {
                setFieldError(input.id, "");
            });

            input.addEventListener("change", function () {
                if (input.type === "checkbox" && input.checked) {
                    setFieldError(input.id, "");
                }
            });
        }
    );

    /* ==========================================
       LOGIN SUBMISSION
       DIRECT ROLE-BASED REDIRECTION

       No signup/account lookup is performed.
    ========================================== */

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        clearStatus();
        clearFormErrors(loginForm);

        const emailInput = document.getElementById(
            "nplAuthLoginEmail"
        );

        const passwordInput = document.getElementById(
            "nplAuthLoginPassword"
        );

        const roleDropdown = loginForm.querySelector(
            "[data-role-dropdown]"
        );

        const emailValid = validateEmail(emailInput);

        const passwordValid = validatePassword(
            passwordInput,
            6
        );

        const role = getSelectedRole(loginForm);

        const roleValid = ["admin", "client"].includes(role);

        if (!roleValid) {
            setRoleError(
                roleDropdown,
                "Please select Admin or Client."
            );
        }

        if (!emailValid || !passwordValid || !roleValid) {
            showStatus(
                "Please complete all required fields correctly.",
                "error"
            );
            return;
        }

        const email = emailInput.value.trim().toLowerCase();

        const session = {
            email: email,
            role: role,
            loggedIn: true,
            loginTime: new Date().toISOString()
        };

        // Save demo session when browser storage is available.
        // Storage failure does not block the redirect.
        try {
            localStorage.setItem(
                SESSION_KEY,
                JSON.stringify(session)
            );

            localStorage.setItem("loginEmail", email);
            localStorage.setItem("loginRole", role);
            localStorage.setItem("stacklyLegalLoggedIn", "true");

            if (rememberCheckbox && rememberCheckbox.checked) {
                localStorage.setItem(REMEMBER_KEY, email);
            } else {
                localStorage.removeItem(REMEMBER_KEY);
            }
        } catch (error) {
            console.warn("Browser storage is unavailable.", error);
        }

        showStatus("Login successful. Redirecting...", "success");

        // Redirect directly based on the selected role.
        if (role === "admin") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "client.html";
        }
    });

    /* ==========================================
       SIGNUP SUBMISSION
    ========================================== */

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        clearStatus();
        clearFormErrors(signupForm);

        const nameInput = document.getElementById(
            "nplAuthSignupName"
        );

        const emailInput = document.getElementById(
            "nplAuthSignupEmail"
        );

        const passwordInput = document.getElementById(
            "nplAuthSignupPassword"
        );

        const confirmInput = document.getElementById(
            "nplAuthConfirmPassword"
        );

        const termsInput = document.getElementById("nplAuthTerms");

        const roleDropdown = signupForm.querySelector(
            "[data-role-dropdown]"
        );

        const name = nameInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;
        const confirmPassword = confirmInput.value;

        let valid = true;

        if (!name) {
            setFieldError(
                nameInput.id,
                "Please enter your full name."
            );
            valid = false;
        } else if (name.length < 2 || !isValidName(name)) {
            setFieldError(
                nameInput.id,
                "Use letters, spaces, apostrophes, or hyphens only."
            );
            valid = false;
        }

        if (!validateEmail(emailInput)) {
            valid = false;
        }

        // Match the signup HTML minlength of 8 characters.
        if (!validatePassword(passwordInput, 6)) {
            valid = false;
        }

        if (!confirmPassword) {
            setFieldError(
                confirmInput.id,
                "Please confirm your password."
            );
            valid = false;
        } else if (password !== confirmPassword) {
            setFieldError(
                confirmInput.id,
                "Passwords do not match."
            );
            valid = false;
        }

        const role = getSelectedRole(signupForm);

        if (!["admin", "client"].includes(role)) {
            setRoleError(
                roleDropdown,
                "Please select Admin or Client."
            );
            valid = false;
        }

        if (!termsInput.checked) {
            setFieldError(
                termsInput.id,
                "Please agree to the Terms of Service and Privacy Policy."
            );
            valid = false;
        }

        if (!valid) {
            showStatus(
                "Please correct the highlighted fields and try again.",
                "error"
            );
            return;
        }

        const users = getUsers();

        const existingUser = users.find(function (item) {
            return (
                item.email &&
                String(item.email).toLowerCase() === email
            );
        });

        if (existingUser) {
            setFieldError(
                emailInput.id,
                "An account with this email already exists."
            );

            showStatus(
                "This email is already registered. Please log in.",
                "error"
            );
            return;
        }

        // Demo signup storage only.
        try {
            users.push({
                name: name,
                email: email,
                role: role,
                password: password,
                createdAt: new Date().toISOString()
            });

            saveUsers(users);

            const loginEmailInput = document.getElementById(
                "nplAuthLoginEmail"
            );

            if (loginEmailInput) {
                loginEmailInput.value = email;
            }

            const loginRoleDropdown = loginForm.querySelector(
                "[data-role-dropdown]"
            );

            if (loginRoleDropdown) {
                selectRole(loginRoleDropdown, role);
            }

            switchMode("login");

            showStatus(
                "Account created successfully. You can now log in.",
                "success"
            );

            const loginPasswordInput = document.getElementById(
                "nplAuthLoginPassword"
            );

            if (loginPasswordInput) {
                loginPasswordInput.focus();
            }
        } catch (error) {
            showStatus(
                "Unable to save your account. Check browser storage settings.",
                "error"
            );
        }
    });

    /* ==========================================
       FORGOT PASSWORD
    ========================================== */

    if (forgotButton) {
        forgotButton.addEventListener("click", function () {
            const emailInput = document.getElementById(
                "nplAuthLoginEmail"
            );

            const email = emailInput.value.trim().toLowerCase();

            if (!email) {
                setFieldError(
                    emailInput.id,
                    "Enter your email address first."
                );

                showStatus(
                    "Please enter your email address first.",
                    "error"
                );

                emailInput.focus();
                return;
            }

            if (!isValidEmail(email)) {
                setFieldError(
                    emailInput.id,
                    "Please enter a valid email address."
                );

                showStatus(
                    "Please enter a valid email address.",
                    "error"
                );
                return;
            }

            showStatus(
                "Password reset requires a secure email-reset service.",
                "success"
            );
        });
    }

    /* ==========================================
       REMEMBER EMAIL
    ========================================== */

    try {
        const rememberedEmail = localStorage.getItem(REMEMBER_KEY);

        const loginEmailInput = document.getElementById(
            "nplAuthLoginEmail"
        );

        if (rememberedEmail && loginEmailInput) {
            loginEmailInput.value = rememberedEmail;

            if (rememberCheckbox) {
                rememberCheckbox.checked = true;
            }
        }
    } catch (error) {
        console.warn("Unable to restore remembered email.");
    }

    /* ==========================================
       INITIAL STATE
    ========================================== */

    switchMode("login");
});