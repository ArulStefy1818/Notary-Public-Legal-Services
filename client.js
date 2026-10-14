
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* =========================================
       MOBILE SIDEBAR
    ========================================= */

    const sidebar = document.getElementById("nplClientSidebar");
    const overlay = document.getElementById("nplClientOverlay");
    const menuButton = document.getElementById("nplClientMenuButton");
    const closeButton = document.getElementById("nplClientMobileClose");

    function openClientMenu() {
        if (!sidebar || !overlay || !menuButton) return;

        sidebar.classList.add("npl-client-sidebar-open");
        overlay.classList.add("npl-client-overlay-visible");

        menuButton.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
    }

    function closeClientMenu() {
        if (!sidebar || !overlay || !menuButton) return;

        sidebar.classList.remove("npl-client-sidebar-open");
        overlay.classList.remove("npl-client-overlay-visible");

        menuButton.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    }

    if (menuButton) {
        menuButton.addEventListener("click", function () {
            const isOpen =
                sidebar &&
                sidebar.classList.contains("npl-client-sidebar-open");

            if (isOpen) {
                closeClientMenu();
            } else {
                openClientMenu();
            }
        });
    }

    if (closeButton) {
        closeButton.addEventListener("click", closeClientMenu);
    }

    if (overlay) {
        overlay.addEventListener("click", closeClientMenu);
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeClientMenu();
        }
    });

    if (sidebar) {
        sidebar
            .querySelectorAll(".npl-client-nav-link")
            .forEach(function (link) {
                link.addEventListener("click", function () {
                    if (window.innerWidth <= 850) {
                        closeClientMenu();
                    }
                });
            });
    }

    window.addEventListener("resize", function () {
        if (window.innerWidth > 850) {
            closeClientMenu();
        }
    });


    /* =========================================
       GET LOGGED-IN CLIENT DETAILS
    ========================================= */

    const nameElement =
        document.getElementById("nplClientUserName");

    const welcomeNameElement =
        document.getElementById("nplClientWelcomeName");

    const emailElement =
        document.getElementById("nplClientUserEmail");

    const avatarElement =
        document.getElementById("nplClientUserAvatar");

    let session = {};
    let storedEmail = "";

    try {
        // Read the current login session
        const rawSession = localStorage.getItem("nplAuthSession");

        if (rawSession) {
            const parsedSession = JSON.parse(rawSession);

            if (
                parsedSession &&
                typeof parsedSession === "object" &&
                !Array.isArray(parsedSession)
            ) {
                session = parsedSession;
            }
        }

        // Get the logged-in email
        storedEmail = String(
            session.email ||
            localStorage.getItem("loginEmail") ||
            ""
        ).trim();

    } catch (error) {
        console.error(
            "Unable to retrieve client account details:",
            error
        );
    }


    /* =========================================
       GENERATE DISPLAY NAME FROM EMAIL
       Example:
       arul.stefy@example.com -> Arul
       john_smith@example.com  -> John
       mary-jane@example.com  -> Mary
    ========================================= */

    function getClientDisplayName(email) {
        if (!email || !email.includes("@")) {
            return "Client";
        }

        const emailUsername = email.split("@")[0].trim();

        // Take only the first word before ., _, -, or whitespace
        const firstWord = emailUsername.split(/[._\-\s]+/)[0];

        if (!firstWord) {
            return "Client";
        }

        return (
            firstWord.charAt(0).toUpperCase() +
            firstWord.slice(1)
        );
    }

    const displayName = getClientDisplayName(storedEmail);


    /* =========================================
       DISPLAY CLIENT NAME
    ========================================= */

    // Header username
    if (nameElement) {
        nameElement.textContent = displayName;
    }

    // Welcome message username
    if (welcomeNameElement) {
        welcomeNameElement.textContent = displayName;
    }


    /* =========================================
       DISPLAY CLIENT AVATAR INITIAL
    ========================================= */

    if (avatarElement) {
        avatarElement.textContent = displayName.charAt(0).toUpperCase();
    }


    /* =========================================
       DISPLAY FULL EMAIL ADDRESS
    ========================================= */

    if (emailElement) {
        if (storedEmail) {
            emailElement.textContent = storedEmail;
            emailElement.href = "mailto:" + storedEmail;
        } else {
            emailElement.textContent = "Please log in";
            emailElement.href = "login.html";
        }
    }


    /* =========================================
       FOOTER CURRENT YEAR
    ========================================= */

    const yearElement =
        document.getElementById("nplClientCurrentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* =========================================
       LOGOUT
    ========================================= */

    const logoutButton =
        document.getElementById("nplClientLogout");

    if (logoutButton) {
        logoutButton.addEventListener("click", function (event) {
            event.preventDefault();

            try {
                localStorage.removeItem("nplAuthSession");
                localStorage.removeItem("loginEmail");
                localStorage.removeItem("loginRole");
                localStorage.removeItem("stacklyLegalLoggedIn");
            } catch (error) {
                console.error(
                    "Unable to clear login session:",
                    error
                );
            }

            // Return to the homepage
            window.location.href = "index.html";
        });
    }
});




document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const searchInput = document.getElementById("nplClientCaseSearch");
    const statusFilter = document.getElementById("nplClientCaseStatusFilter");
    const categoryFilter = document.getElementById("nplClientCaseCategoryFilter");
    const tableBody = document.getElementById("nplClientCasesTableBody");
    const noResults = document.getElementById("nplClientCasesNoResults");
    const resultCount = document.getElementById("nplClientCasesResultCount");
    const resetButton = document.getElementById("nplClientCasesReset");

    if (!tableBody) return;

    const caseRows = Array.from(tableBody.querySelectorAll("tr"));

    function filterClientCases() {
        const searchTerm = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        const selectedStatus = statusFilter
            ? statusFilter.value
            : "all";

        const selectedCategory = categoryFilter
            ? categoryFilter.value
            : "all";

        let visibleCount = 0;

        caseRows.forEach(function (row) {
            const rowText = row.textContent.toLowerCase();
            const rowStatus = row.dataset.caseStatus || "";
            const rowCategory = row.dataset.caseCategory || "";

            const matchesSearch = rowText.includes(searchTerm);

            const matchesStatus =
                selectedStatus === "all" ||
                rowStatus === selectedStatus;

            const matchesCategory =
                selectedCategory === "all" ||
                rowCategory === selectedCategory;

            const isVisible =
                matchesSearch && matchesStatus && matchesCategory;

            row.hidden = !isVisible;

            if (isVisible) {
                visibleCount++;
            }
        });

        if (noResults) {
            noResults.hidden = visibleCount !== 0;
        }

        if (resultCount) {
            resultCount.textContent =
                "Showing " + visibleCount + " of " +
                caseRows.length + " cases";
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterClientCases);
    }

    if (statusFilter) {
        statusFilter.addEventListener("change", filterClientCases);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", filterClientCases);
    }

    if (resetButton) {
        resetButton.addEventListener("click", function () {
            if (searchInput) searchInput.value = "";
            if (statusFilter) statusFilter.value = "all";
            if (categoryFilter) categoryFilter.value = "all";

            filterClientCases();
        });
    }

    // Copy a case reference when supported by the browser.
    document.querySelectorAll("[data-copy-case]").forEach(function (button) {
        button.addEventListener("click", async function () {
            const caseReference = button.dataset.copyCase;

            if (!caseReference) return;

            try {
                await navigator.clipboard.writeText(caseReference);

                const originalHTML = button.innerHTML;
                button.innerHTML = '<i class="fa-solid fa-check"></i>';
                button.setAttribute("aria-label", "Case reference copied");

                window.setTimeout(function () {
                    button.innerHTML = originalHTML;
                    button.setAttribute("aria-label", "Copy case reference");
                }, 1500);
            } catch (error) {
                // Fallback for browsers where Clipboard API is unavailable.
                window.prompt("Copy this case reference:", caseReference);
            }
        });
    });

    filterClientCases();
});



document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* ==========================================
       ELEMENTS
    ========================================== */

    const form = document.querySelector(".npl-client-appt-form");
    const feedback = document.getElementById("nplClientApptFeedback");
    const dateInput = document.getElementById("nplClientApptDate");

    if (!form) {
        console.warn("Appointment form not found.");
        return;
    }

    /* ==========================================
       LOCAL DATE / PREVENT PAST DATES
    ========================================== */

    function getLocalDate() {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function updateMinimumDate() {
        if (dateInput) {
            dateInput.min = getLocalDate();
        }
    }

    updateMinimumDate();

    if (dateInput) {
        dateInput.addEventListener("change", function () {
            updateMinimumDate();

            if (dateInput.value && dateInput.value < getLocalDate()) {
                dateInput.value = "";

                showMessage(
                    "Please select today or a future date.",
                    "error"
                );
            }
        });
    }

    /* ==========================================
       FEEDBACK MESSAGES
    ========================================== */

    let feedbackTimer;

    function showMessage(message, type) {
        if (!feedback) {
            alert(message);
            return;
        }

        clearTimeout(feedbackTimer);

        feedback.textContent = message;
        feedback.className =
            "npl-client-appt-feedback " +
            (type === "success"
                ? "npl-client-appt-success"
                : "npl-client-appt-error");

        feedback.hidden = false;

        feedback.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

        feedbackTimer = setTimeout(function () {
            feedback.hidden = true;
            feedback.textContent = "";
        }, 4500);
    }

    /* ==========================================
       CUSTOM DROPDOWNS
       Consultation Type / Preferred Time /
       Meeting Preference
    ========================================== */

    const dropdownConfigs = [
        {
            wrapper: ".npl-client-appt-custom-select",
            trigger: ".npl-client-appt-select-trigger",
            selected: ".npl-client-appt-selected-text",
            input: "#nplClientApptTypeValue",
            panel: ".npl-client-appt-select-options",
            placeholder: "Select consultation"
        },
        {
            wrapper: ".npl-client-appt-time-select",
            trigger: ".npl-client-appt-time-trigger",
            selected: ".npl-client-appt-time-selected",
            input: "#nplClientApptTimeValue",
            panel: ".npl-client-appt-time-options",
            placeholder: "Select time"
        },
        {
            wrapper: ".npl-client-appt-mode-select",
            trigger: ".npl-client-appt-mode-trigger",
            selected: ".npl-client-appt-mode-selected",
            input: "#nplClientApptModeValue",
            panel: ".npl-client-appt-mode-options",
            placeholder: "Choose meeting format"
        }
    ];

    const dropdowns = [];

    function closeAllDropdowns(exceptDropdown) {
        dropdowns.forEach(function (dropdown) {
            if (dropdown !== exceptDropdown) {
                dropdown.close();
            }
        });
    }

    dropdownConfigs.forEach(function (config) {
        const wrapper = form.querySelector(config.wrapper);

        if (!wrapper) {
            console.warn("Dropdown wrapper not found:", config.wrapper);
            return;
        }

        const trigger = wrapper.querySelector(config.trigger);
        const selected = wrapper.querySelector(config.selected);
        const input = wrapper.querySelector(config.input);
        const panel = wrapper.querySelector(config.panel);

        if (!trigger || !selected || !input || !panel) {
            console.warn("Dropdown elements missing:", config.wrapper);
            return;
        }

        const options = Array.from(
            panel.querySelectorAll('button[role="option"]')
        );

        /* Ensure the options panel starts closed */
        panel.hidden = true;
        trigger.setAttribute("aria-expanded", "false");

        const dropdown = {
            wrapper: wrapper,
            trigger: trigger,
            selected: selected,
            input: input,
            panel: panel,
            options: options,
            placeholder: config.placeholder,

            open: function () {
                closeAllDropdowns(this);

                panel.hidden = false;
                wrapper.classList.add("is-open");
                trigger.setAttribute("aria-expanded", "true");
            },

            close: function () {
                panel.hidden = true;
                wrapper.classList.remove("is-open");
                trigger.setAttribute("aria-expanded", "false");
            },

            reset: function () {
                input.value = "";
                selected.textContent = config.placeholder;

                options.forEach(function (option) {
                    option.classList.remove("is-selected");
                    option.setAttribute("aria-selected", "false");
                });

                this.close();
            },

            selectOption: function (option) {
                input.value = option.dataset.value || "";

                const text = option.querySelector("span");

                selected.textContent = text
                    ? text.textContent.trim()
                    : option.textContent.trim();

                options.forEach(function (item) {
                    const isSelected = item === option;

                    item.classList.toggle("is-selected", isSelected);
                    item.setAttribute(
                        "aria-selected",
                        String(isSelected)
                    );
                });

                this.close();
            }
        };

        /* Open and close on trigger click */
        trigger.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (panel.hidden) {
                dropdown.open();
            } else {
                dropdown.close();
            }
        });

        /* Select an option */
        options.forEach(function (option, index) {
            option.setAttribute("aria-selected", "false");

            option.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();

                dropdown.selectOption(option);
                trigger.focus();
            });

            /* Keyboard navigation */
            option.addEventListener("keydown", function (event) {
                if (event.key === "ArrowDown") {
                    event.preventDefault();

                    const next = options[index + 1];
                    if (next) next.focus();
                }

                if (event.key === "ArrowUp") {
                    event.preventDefault();

                    const previous = options[index - 1];

                    if (previous) {
                        previous.focus();
                    } else {
                        trigger.focus();
                    }
                }

                if (event.key === "Escape") {
                    event.preventDefault();
                    dropdown.close();
                    trigger.focus();
                }

                if (event.key === "Tab") {
                    dropdown.close();
                }
            });
        });

        /* Keyboard support on the trigger */
        trigger.addEventListener("keydown", function (event) {
            if (
                event.key === "Enter" ||
                event.key === " " ||
                event.key === "ArrowDown"
            ) {
                event.preventDefault();

                if (panel.hidden) {
                    dropdown.open();
                }

                if (options.length) {
                    options[0].focus();
                }
            }

            if (event.key === "Escape") {
                dropdown.close();
            }
        });

        dropdowns.push(dropdown);
    });

    /* Close dropdowns when clicking outside */
    document.addEventListener("click", function (event) {
        dropdowns.forEach(function (dropdown) {
            if (!dropdown.wrapper.contains(event.target)) {
                dropdown.close();
            }
        });
    });

    /* ==========================================
       VALIDATION HELPERS
    ========================================== */

    function focusDropdown(index) {
        const dropdown = dropdowns[index];

        if (dropdown) {
            dropdown.trigger.focus();
            dropdown.open();
        }
    }

    function getField(id) {
        return form.querySelector("#" + id);
    }

    /* ==========================================
       FORM SUBMISSION
    ========================================== */

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        clearTimeout(feedbackTimer);

        if (feedback) {
            feedback.hidden = true;
        }

        updateMinimumDate();

        const consultationType = getField("nplClientApptTypeValue");
        const appointmentTime = getField("nplClientApptTimeValue");
        const meetingMode = getField("nplClientApptModeValue");

        /* Consultation type */
        if (!consultationType || !consultationType.value) {
            showMessage("Please select a consultation type.", "error");
            focusDropdown(0);
            return;
        }

        /* Appointment date */
        if (!dateInput || !dateInput.value) {
            showMessage("Please select your preferred appointment date.", "error");

            if (dateInput) dateInput.focus();
            return;
        }

        if (dateInput.value < getLocalDate()) {
            showMessage(
                "Past dates are not allowed. Please select today or a future date.",
                "error"
            );

            dateInput.value = "";
            dateInput.focus();
            return;
        }

        /* Appointment time */
        if (!appointmentTime || !appointmentTime.value) {
            showMessage("Please select your preferred time.", "error");
            focusDropdown(1);
            return;
        }

        /* Meeting preference */
        if (!meetingMode || !meetingMode.value) {
            showMessage("Please choose your meeting preference.", "error");
            focusDropdown(2);
            return;
        }

        /* Other required fields */
        if (!form.checkValidity()) {
            form.reportValidity();

            showMessage(
                "Please complete all required fields.",
                "error"
            );
            return;
        }

        /* ======================================
           SUCCESS AND RESET
        ====================================== */

        form.reset();

        dropdowns.forEach(function (dropdown) {
            dropdown.reset();
        });

        updateMinimumDate();

        showMessage(
            "Appointment request submitted successfully!",
            "success"
        );
    });

});



/* =========================================================
   STACKLY LEGAL SERVICES
   CLIENT MESSAGES CHAT
   Professional Chat Interactions
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const chat = document.querySelector(".npl-messages-chat");

    if (!chat) return;

    const history = chat.querySelector(".npl-messages-history");
    const replyForm = chat.querySelector(".npl-messages-reply");
    const messageInput = chat.querySelector("#nplMessagesInput");
    const sendButton = replyForm
        ? replyForm.querySelector('button[type="submit"]')
        : null;

    if (!history || !replyForm || !messageInput || !sendButton) return;

    let typingTimer = null;
    let typingIndicator = null;
    let messageCount = 0;

    /* =====================================================
       FORMAT CURRENT TIME
    ===================================================== */

    function getCurrentTime() {
        return new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }).format(new Date());
    }

    /* =====================================================
       SCROLL TO LATEST MESSAGE
    ===================================================== */

    function scrollToLatestMessage(smooth = true) {
        history.scrollTo({
            top: history.scrollHeight,
            behavior: smooth ? "smooth" : "auto"
        });
    }

    /* =====================================================
       CREATE MESSAGE ELEMENTS SAFELY
    ===================================================== */

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    /* =====================================================
       UPDATE DELIVERY STATUS
    ===================================================== */

    function createDeliveryStatus() {
        const status = createElement(
            "span",
            "npl-messages-delivered"
        );

        const icon = createElement("i", "fa-solid fa-check");

        icon.setAttribute("aria-hidden", "true");

        status.append(icon, document.createTextNode(" Sent"));

        return status;
    }

    /* =====================================================
       CREATE OUTGOING MESSAGE BUBBLE
    ===================================================== */

    function createOutgoingMessage(message) {
        const row = createElement(
            "div",
            "npl-messages-bubble-row npl-messages-outgoing"
        );

        const wrapper = createElement(
            "div",
            "npl-messages-bubble-wrap"
        );

        const time = createElement(
            "span",
            "npl-messages-time",
            getCurrentTime()
        );

        const bubble = createElement(
            "div",
            "npl-messages-bubble",
            message
        );

        const status = createDeliveryStatus();

        bubble.setAttribute("dir", "auto");
        bubble.style.whiteSpace = "pre-wrap";

        wrapper.append(time, bubble, status);
        row.appendChild(wrapper);

        row.setAttribute("aria-label", "Your message");

        return row;
    }

    /* =====================================================
       TEMPORARY TYPING INDICATOR
    ===================================================== */

    function showTypingIndicator() {
        removeTypingIndicator();

        typingIndicator = createElement(
            "div",
            "npl-messages-bubble-row npl-messages-typing"
        );

        typingIndicator.setAttribute(
            "aria-label",
            "Your legal advisor is typing"
        );

        const avatar = createElement(
            "div",
            "npl-messages-chat-avatar",
            "SM"
        );

        const wrapper = createElement(
            "div",
            "npl-messages-bubble-wrap"
        );

        const label = createElement(
            "span",
            "npl-messages-time",
            "Sarah Mitchell is typing"
        );

        const dots = createElement(
            "div",
            "npl-messages-typing-dots"
        );

        dots.setAttribute("aria-hidden", "true");

        for (let i = 0; i < 3; i++) {
            dots.appendChild(createElement("span", ""));
        }

        wrapper.append(label, dots);
        typingIndicator.append(avatar, wrapper);

        history.appendChild(typingIndicator);

        scrollToLatestMessage();
    }

    function removeTypingIndicator() {
        if (typingIndicator && typingIndicator.isConnected) {
            typingIndicator.remove();
        }

        typingIndicator = null;
    }

    /* =====================================================
       SEND MESSAGE
    ===================================================== */

    function sendMessage() {
        const message = messageInput.value.trim();

        if (!message) {
            messageInput.value = "";
            messageInput.focus();
            return;
        }

        if (sendButton.disabled) return;

        sendButton.disabled = true;
        sendButton.classList.add("npl-messages-sending");

        const outgoingMessage = createOutgoingMessage(message);

        history.appendChild(outgoingMessage);

        messageCount++;

        messageInput.value = "";
        messageInput.style.height = "";

        scrollToLatestMessage();

        /* Restore the button after the short UI transition. */
        window.setTimeout(function () {
            sendButton.disabled = false;
            sendButton.classList.remove("npl-messages-sending");
            messageInput.focus();
        }, 250);

        /*
          Demo-only typing indicator.
          Remove this section when connecting a real messaging API.
        */
        showTypingIndicator();

        window.clearTimeout(typingTimer);

        typingTimer = window.setTimeout(function () {
            removeTypingIndicator();
        }, 1800);
    }

    /* =====================================================
       FORM SUBMISSION
    ===================================================== */

    replyForm.addEventListener("submit", function (event) {
        event.preventDefault();
        sendMessage();
    });

    /* =====================================================
       ENTER TO SEND
       SHIFT + ENTER CAN BE USED FOR A NEW LINE IF INPUT
       IS CHANGED TO A TEXTAREA.
    ===================================================== */

    messageInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            replyForm.requestSubmit();
        }
    });

    /* =====================================================
       SEARCH CONVERSATION MESSAGES
       OPTIONAL: WORKS IF A SEARCH INPUT IS PRESENT
       OUTSIDE THIS CHAT SECTION.
    ===================================================== */

    const searchInput = document.querySelector(
        ".npl-messages-search input"
    );

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const searchTerm = this.value.trim().toLowerCase();

            const contacts = document.querySelectorAll(
                ".npl-messages-contact"
            );

            contacts.forEach(function (contact) {
                const contactText = contact.textContent.toLowerCase();

                contact.hidden = !contactText.includes(searchTerm);
            });
        });
    }

    /* =====================================================
       ACCESSIBILITY: ANNOUNCE NEWLY SENT MESSAGES
    ===================================================== */

    history.setAttribute("aria-live", "polite");
    history.setAttribute("aria-relevant", "additions text");

    /* =====================================================
       INITIAL CHAT POSITION
    ===================================================== */

    requestAnimationFrame(function () {
        scrollToLatestMessage(false);
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const profileName = document.getElementById("nplProfileName");

    // Get the logged-in user's email
    const userEmail =
        localStorage.getItem("loginEmail") ||
        localStorage.getItem("clientEmail") ||
        "";

    if (profileName && userEmail.includes("@")) {
        // Extract the name before @ and use its first word
        const emailName = userEmail.split("@")[0];
        const firstWord = emailName.split(/[._\-\s]+/)[0];

        // Capitalize the first letter
        const displayName =
            firstWord.charAt(0).toUpperCase() + firstWord.slice(1);

        profileName.textContent = displayName;
    }
});


const profileEmail = document.getElementById("nplProfileEmail");

const userEmail =
    localStorage.getItem("loginEmail") ||
    localStorage.getItem("clientEmail") ||
    "";

if (profileEmail && userEmail) {
    profileEmail.textContent = userEmail;
}



const avatarLetter = document.getElementById("nplProfileAvatarLetter");

if (avatarLetter && userEmail.includes("@")) {
    const emailName = userEmail.split("@")[0];
    const firstWord = emailName.split(/[._\-\s]+/)[0];

    if (firstWord) {
        avatarLetter.textContent = firstWord.charAt(0).toUpperCase();
    }
}



const fullNameElement = document.getElementById("nplProfileFullName");

if (fullNameElement && userEmail.includes("@")) {
    const emailName = userEmail.split("@")[0];
    const firstWord = emailName.split(/[._\-\s]+/)[0];

    if (firstWord) {
        fullNameElement.textContent =
            firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
    }
}


const infoEmail = document.getElementById("nplProfileInfoEmail");

if (infoEmail && userEmail) {
    infoEmail.textContent = userEmail;
}
