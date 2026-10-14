
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* ==========================================
       ELEMENTS
    ========================================== */

    const sidebar = document.getElementById("nplAdminSidebar");
    const overlay = document.getElementById("nplAdminOverlay");
    const menuButton = document.getElementById("nplAdminMenuToggle");
    const closeButton = document.getElementById("nplAdminClose");
    const dateElement = document.getElementById("nplAdminDate");

    const emailElement = document.getElementById("nplAdminUserEmail");
    const nameElement = document.getElementById("nplAdminUserName");

    /* ==========================================
       GET SAVED LOGIN DETAILS
    ========================================== */

    function getLoginDetails() {
        let email = "";
        let role = "";
        let loggedIn = false;

        try {
            // Read the individual values saved by login.js.
            email = localStorage.getItem("loginEmail") || "";
            role = localStorage.getItem("loginRole") || "";

            // Also check the saved session object.
            const sessionText = localStorage.getItem("nplAuthSession");

            if (sessionText) {
                const session = JSON.parse(sessionText);

                if (session && typeof session === "object") {
                    email = email || session.email || "";
                    role = role || session.role || "";
                    loggedIn = session.loggedIn === true;
                }
            }

            // Support other existing session flags.
            if (localStorage.getItem("stacklyLegalLoggedIn") === "true") {
                loggedIn = true;
            }

            if (localStorage.getItem("stacklyLegalLoggedIn") === "false") {
                loggedIn = false;
            }

        } catch (error) {
            console.warn("Unable to read saved login details.", error);
        }

        return {
            email: email.trim(),
            role: role.trim().toLowerCase(),
            loggedIn: loggedIn
        };
    }

    /* ==========================================
       DISPLAY ADMIN EMAIL
    ========================================== */

    function displayAdminDetails() {
        if (!emailElement) {
            console.error(
                "Email element not found. Add id='nplAdminUserEmail' to the email link."
            );
            return;
        }

        const details = getLoginDetails();

        // Use the saved email or the default admin email.
        const email = details.email || "admin@stacklylegal.com";

        emailElement.textContent = email;
        emailElement.href = "mailto:" + email;

        // Display the role when an admin has selected it.
        if (nameElement && details.role === "admin") {
            nameElement.textContent = "Administrator";
        } else if (nameElement && details.role === "client") {
            nameElement.textContent = "Client Account";
        }
    }

    displayAdminDetails();

    /* ==========================================
       MOBILE SIDEBAR
    ========================================== */

    function openSidebar() {
        if (!sidebar || !overlay) return;

        sidebar.classList.add("npl-admin-sidebar-open");
        overlay.classList.add("npl-admin-overlay-visible");

        if (menuButton) {
            menuButton.setAttribute("aria-expanded", "true");
        }

        document.body.style.overflow = "hidden";
    }

    function closeSidebar() {
        if (sidebar) {
            sidebar.classList.remove("npl-admin-sidebar-open");
        }

        if (overlay) {
            overlay.classList.remove("npl-admin-overlay-visible");
        }

        if (menuButton) {
            menuButton.setAttribute("aria-expanded", "false");
        }

        document.body.style.overflow = "";
    }

    if (menuButton) {
        menuButton.addEventListener("click", openSidebar);
    }

    if (closeButton) {
        closeButton.addEventListener("click", closeSidebar);
    }

    if (overlay) {
        overlay.addEventListener("click", closeSidebar);
    }

    /* ==========================================
       CLOSE MENU WITH ESCAPE KEY
    ========================================== */

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeSidebar();
        }
    });

    /* ==========================================
       CLOSE MENU AFTER NAVIGATION CLICK
    ========================================== */

    if (sidebar) {
        sidebar.querySelectorAll(".npl-admin-nav-link").forEach(
            function (link) {
                link.addEventListener("click", function () {
                    if (window.innerWidth <= 850) {
                        closeSidebar();
                    }
                });
            }
        );
    }

    /* ==========================================
       RESPONSIVE RESIZE
    ========================================== */

    window.addEventListener("resize", function () {
        if (window.innerWidth > 850) {
            closeSidebar();
        }
    });

    /* ==========================================
       CURRENT DATE
    ========================================== */

    if (dateElement) {
        dateElement.textContent = new Intl.DateTimeFormat("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(new Date());
    }

});


const adminWelcomeHeading = document.getElementById("nplAdminWelcomeHeading");

if (adminWelcomeHeading) {
    const email =
        localStorage.getItem("loginEmail") ||
        "admin@stacklylegal.com";

    // Get the first word before @ and capitalize it
    const firstWord = email
        .split("@")[0]
        .split(/[._\-\s]/)[0];

    const adminName = firstWord
        ? firstWord.charAt(0).toUpperCase() + firstWord.slice(1)
        : "Admin";

    adminWelcomeHeading.textContent = `Welcome Back, ${adminName}`;
}



document.addEventListener("DOMContentLoaded", function () {
    const root = document.querySelector(".npl-appt-workspace");

    if (!root) return;

    const $ = (selector) => root.querySelector(selector);

    const search = $("#nplApptSearch");
    const statusFilter = $("#nplApptStatusFilter");
    const serviceFilter = $("#nplApptServiceFilter");
    const tableBody = $("#nplApptTableBody");
    const noResults = $("#nplApptNoResults");
    const resultCount = $("#nplApptResultCount");
    const modal = $("#nplApptModal");
    const detailsModal = $("#nplApptDetailsModal");
    const form = $("#nplApptForm");
    const toast = $("#nplApptToast");

    let selectedRow = null;
    let selectedDate = new Date(2026, 9, 19);
    let calendarMonth = new Date(2026, 9, 1);
    let timelineDate = new Date(2026, 9, 19);
    let toastTimer;

    const appointments = [
        { day: 19, month: 9, year: 2026 },
        { day: 20, month: 9, year: 2026 },
        { day: 21, month: 9, year: 2026 },
        { day: 22, month: 9, year: 2026 },
        { day: 26, month: 9, year: 2026 },
        { day: 29, month: 9, year: 2026 }
    ];

    const escapeHTML = (value) =>
        String(value).replace(/[&<>"']/g, (char) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("npl-appt-toast-visible");

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove("npl-appt-toast-visible");
        }, 3000);
    }

    function formatDate(date) {
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).format(date);
    }

    function filterAppointments() {
        const query = search.value.trim().toLowerCase();
        const status = statusFilter.value;
        const service = serviceFilter.value;
        let visible = 0;

        tableBody.querySelectorAll("tr[data-status]").forEach((row) => {
            const matchesText = row.textContent.toLowerCase().includes(query);
            const matchesStatus =
                status === "all" || row.dataset.status === status;
            const matchesService =
                service === "all" || row.dataset.service === service;

            const show = matchesText && matchesStatus && matchesService;
            row.hidden = !show;

            if (show) visible++;
        });

        noResults.hidden = visible !== 0;
        resultCount.textContent =
            `Showing ${visible} appointment${visible === 1 ? "" : "s"}`;

        return visible;
    }

    search.addEventListener("input", filterAppointments);
    statusFilter.addEventListener("change", filterAppointments);
    serviceFilter.addEventListener("change", filterAppointments);

    function openModal(element) {
        element.classList.add("npl-appt-modal-open");
        element.setAttribute("aria-hidden", "false");
        document.body.classList.add("npl-appt-modal-active");

        const focusable = element.querySelector(
            "input, select, textarea, button"
        );

        if (focusable) focusable.focus();
    }

    function closeModal(element) {
        element.classList.remove("npl-appt-modal-open");
        element.setAttribute("aria-hidden", "true");

        if (!root.querySelector(".npl-appt-modal-open")) {
            document.body.classList.remove("npl-appt-modal-active");
        }
    }

    $("#nplApptAddBtn").addEventListener("click", () => {
        form.reset();

        const dateInput = form.elements.date;
        dateInput.min = new Date().toLocaleDateString("en-CA");
        dateInput.value = selectedDate >= new Date(
            new Date().setHours(0, 0, 0, 0)
        ) ? [
            selectedDate.getFullYear(),
            String(selectedDate.getMonth() + 1).padStart(2, "0"),
            String(selectedDate.getDate()).padStart(2, "0")
        ].join("-") : dateInput.min;

        openModal(modal);
    });

    root.querySelectorAll("[data-close-modal]").forEach((button) => {
        button.addEventListener("click", () => {
            const parent = button.closest(".npl-appt-modal");
            if (parent) closeModal(parent);
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            [modal, detailsModal].forEach((element) => closeModal(element));
        }
    });

    function getStatusClass(status) {
        return {
            confirmed: "npl-appt-status-confirmed",
            pending: "npl-appt-status-pending",
            completed: "npl-appt-status-completed",
            cancelled: "npl-appt-status-cancelled"
        }[status] || "npl-appt-status-pending";
    }

    function getServiceLabel(service) {
        return {
            notary: "Notary Services",
            consultation: "Legal Consultation",
            corporate: "Corporate Legal",
            document: "Document Review"
        }[service] || "Legal Services";
    }

    function buildRow(data) {
        const initials = data.client.trim().split(/\s+/)
            .slice(0, 2).map((part) => part[0].toUpperCase()).join("");

        const row = document.createElement("tr");
        row.dataset.status = "pending";
        row.dataset.service = data.service;

        row.innerHTML = `
            <td>
                <div class="npl-appt-client">
                    <span class="npl-appt-client-avatar npl-appt-avatar-one">
                        ${escapeHTML(initials)}
                    </span>
                    <div>
                        <strong>${escapeHTML(data.client)}</strong>
                        <span>${escapeHTML(data.email)}</span>
                    </div>
                </div>
            </td>
            <td>
                <span class="npl-appt-service-name">
                    ${escapeHTML(data.serviceName)}
                </span>
                <span class="npl-appt-service-type">
                    ${escapeHTML(getServiceLabel(data.service))}
                </span>
            </td>
            <td>
                <strong>${escapeHTML(formatDate(new Date(data.date + "T12:00:00")))}</strong>
                <span class="npl-appt-table-subtext">
                    ${escapeHTML(data.time)}
                </span>
            </td>
            <td>${escapeHTML(data.professional)}</td>
            <td>
                <span class="npl-appt-status npl-appt-status-pending">
                    Pending
                </span>
            </td>
            <td>
                <button type="button" class="npl-appt-action-btn"
                    data-action="details" aria-label="View appointment">
                    <i class="fa-regular fa-eye"></i>
                </button>
            </td>
        `;

        row.dataset.email = data.email;
        row.dataset.notes = data.notes || "";
        row.dataset.client = data.client;
        row.dataset.professional = data.professional;
        row.dataset.date = data.date;
        row.dataset.time = data.time;

        return row;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const data = Object.fromEntries(new FormData(form).entries());

        if (data.date < new Date().toLocaleDateString("en-CA")) {
            showToast("Please choose a current or future date.");
            return;
        }

        const newRow = buildRow({
            ...data,
            serviceName: getServiceLabel(data.service)
        });

        tableBody.insertBefore(newRow, noResults);

        closeModal(modal);
        filterAppointments();
        renderCalendar();

        showToast("Appointment added with pending status.");
    });

    function showDetails(row) {
        selectedRow = row;

        const client = row.querySelector(".npl-appt-client strong")?.textContent || "";
        const email = row.dataset.email ||
            row.querySelector(".npl-appt-client div span")?.textContent || "";
        const service = row.querySelector(".npl-appt-service-name")?.textContent || "";
        const date = row.querySelector("td:nth-child(3) strong")?.textContent || "";
        const time = row.querySelector(".npl-appt-table-subtext")?.textContent || "";
        const professional = row.dataset.professional ||
            row.querySelector("td:nth-child(4)")?.textContent || "";
        const status = row.dataset.status;
        const notes = row.dataset.notes || "No additional notes provided.";

        $("#nplApptDetailsContent").innerHTML = `
            <div class="npl-appt-detail-person">
                <span class="npl-appt-detail-avatar">
                    ${escapeHTML(client.split(/\s+/).map(p => p[0]).slice(0, 2).join(""))}
                </span>
                <div>
                    <h4>${escapeHTML(client)}</h4>
                    <p>${escapeHTML(email)}</p>
                </div>
            </div>
            <div class="npl-appt-detail-grid">
                <div><span>Legal Service</span><strong>${escapeHTML(service)}</strong></div>
                <div><span>Appointment Date</span><strong>${escapeHTML(date)}</strong></div>
                <div><span>Appointment Time</span><strong>${escapeHTML(time)}</strong></div>
                <div><span>Assigned Professional</span><strong>${escapeHTML(professional)}</strong></div>
                <div><span>Current Status</span><strong>${escapeHTML(status)}</strong></div>
                <div><span>Additional Notes</span><strong>${escapeHTML(notes)}</strong></div>
            </div>
        `;

        const confirmButton = $("#nplApptConfirmBtn");
        const canConfirm = status === "pending";

        confirmButton.hidden = !canConfirm;
        openModal(detailsModal);
    }

    tableBody.addEventListener("click", function (event) {
        const button = event.target.closest('[data-action="details"]');
        if (!button) return;

        const row = button.closest("tr[data-status]");
        if (row) showDetails(row);
    });

    $("#nplApptConfirmBtn").addEventListener("click", function () {
        if (!selectedRow || selectedRow.dataset.status !== "pending") return;

        selectedRow.dataset.status = "confirmed";

        const badge = selectedRow.querySelector(".npl-appt-status");
        badge.className =
            `npl-appt-status ${getStatusClass("confirmed")}`;
        badge.textContent = "Confirmed";

        closeModal(detailsModal);
        filterAppointments();
        renderCalendar();
        showToast("Appointment confirmed successfully.");
    });

    function renderCalendar() {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();

        $("#nplApptMonthLabel").textContent =
            calendarMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric"
            });

        const grid = $("#nplApptCalendarGrid");
        grid.innerHTML = `
            <span class="npl-appt-weekday">Mon</span>
            <span class="npl-appt-weekday">Tue</span>
            <span class="npl-appt-weekday">Wed</span>
            <span class="npl-appt-weekday">Thu</span>
            <span class="npl-appt-weekday">Fri</span>
            <span class="npl-appt-weekday">Sat</span>
            <span class="npl-appt-weekday">Sun</span>
        `;

        const firstDay = new Date(year, month, 1);
        const offset = (firstDay.getDay() + 6) % 7;
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < offset; i++) {
            const blank = document.createElement("span");
            blank.className = "npl-appt-calendar-empty";
            grid.appendChild(blank);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const button = document.createElement("button");
            const date = new Date(year, month, day);
            const hasAppointment = appointments.some(item =>
                item.day === day &&
                item.month === month &&
                item.year === year
            );

            button.type = "button";
            button.className = "npl-appt-calendar-day";
            button.textContent = day;

            if (hasAppointment) {
                button.classList.add("npl-appt-has-booking");
            }

            if (
                date.getFullYear() === selectedDate.getFullYear() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getDate() === selectedDate.getDate()
            ) {
                button.classList.add("npl-appt-day-selected");
            }

            button.addEventListener("click", () => {
                selectedDate = new Date(year, month, day);

                $("#nplApptCalendarSelected").textContent =
                    formatDate(selectedDate);

                $("#nplApptSelectedDay").textContent =
                    selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric"
                    });

                renderCalendar();
                renderTimelineDate();

                showToast(`Selected ${formatDate(selectedDate)}.`);
            });

            grid.appendChild(button);
        }
    }

    function renderTimelineDate() {
        const dateLabel = $("#nplApptSelectedDay");
        dateLabel.textContent = timelineDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric"
        });

        const rows = [...tableBody.querySelectorAll("tr[data-status]")];
        const targetDate = [
            timelineDate.getFullYear(),
            String(timelineDate.getMonth() + 1).padStart(2, "0"),
            String(timelineDate.getDate()).padStart(2, "0")
        ].join("-");

        const matchingRows = rows.filter(row => row.dataset.date === targetDate);

        $("#nplApptSelectedCount").textContent =
            `${matchingRows.length} appointment${matchingRows.length === 1 ? "" : "s"} scheduled`;

        const timeline = $("#nplApptTimeline");
        timeline.innerHTML = "";

        if (!matchingRows.length) {
            timeline.innerHTML = `
                <div class="npl-appt-empty-day">
                    <i class="fa-regular fa-calendar"></i>
                    <strong>No appointments listed</strong>
                    <span>Choose another date or create a new appointment.</span>
                </div>
            `;
            return;
        }

        matchingRows.forEach(row => {
            const client = row.querySelector(".npl-appt-client strong")?.textContent || "";
            const service = row.querySelector(".npl-appt-service-name")?.textContent || "";
            const time = row.querySelector(".npl-appt-table-subtext")?.textContent || "";
            const status = row.dataset.status;

            const item = document.createElement("div");
            item.className = "npl-appt-generated-event";
            item.innerHTML = `
                <span class="npl-appt-generated-time">${escapeHTML(time)}</span>
                <div>
                    <strong>${escapeHTML(service)}</strong>
                    <span>${escapeHTML(client)}</span>
                    <span class="npl-appt-status ${getStatusClass(status)}">
                        ${escapeHTML(status)}
                    </span>
                </div>
            `;

            timeline.appendChild(item);
        });
    }

    $("#nplApptPrevMonth").addEventListener("click", () => {
        calendarMonth.setMonth(calendarMonth.getMonth() - 1);
        renderCalendar();
    });

    $("#nplApptNextMonth").addEventListener("click", () => {
        calendarMonth.setMonth(calendarMonth.getMonth() + 1);
        renderCalendar();
    });

    $("#nplApptPrevDay").addEventListener("click", () => {
        timelineDate.setDate(timelineDate.getDate() - 1);
        selectedDate = new Date(timelineDate);
        calendarMonth = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            1
        );

        $("#nplApptCalendarSelected").textContent = formatDate(selectedDate);
        renderCalendar();
        renderTimelineDate();
    });

    $("#nplApptNextDay").addEventListener("click", () => {
        timelineDate.setDate(timelineDate.getDate() + 1);
        selectedDate = new Date(timelineDate);
        calendarMonth = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            1
        );

        $("#nplApptCalendarSelected").textContent = formatDate(selectedDate);
        renderCalendar();
        renderTimelineDate();
    });

    $("#nplApptExport").addEventListener("click", () => {
        const rows = [...tableBody.querySelectorAll("tr[data-status]")]
            .filter(row => !row.hidden);

        const csv = [
            ["Client", "Email", "Service", "Date", "Time", "Professional", "Status"],
            ...rows.map(row => [
                row.querySelector(".npl-appt-client strong")?.textContent || "",
                row.dataset.email ||
                    row.querySelector(".npl-appt-client div span")?.textContent || "",
                row.querySelector(".npl-appt-service-name")?.textContent || "",
                row.querySelector("td:nth-child(3) strong")?.textContent || "",
                row.querySelector(".npl-appt-table-subtext")?.textContent || "",
                row.dataset.professional ||
                    row.querySelector("td:nth-child(4)")?.textContent || "",
                row.dataset.status || ""
            ])
        ];

        const escapeCSV = value =>
            `"${String(value).replace(/"/g, '""')}"`;

        const csvContent = csv.map(row => row.map(escapeCSV).join(",")).join("\r\n");
        const blob = new Blob(["\uFEFF" + csvContent], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "stackly-legal-appointments.csv";
        link.click();

        URL.revokeObjectURL(url);
        showToast("Appointment schedule exported.");
    });

    renderCalendar();
    renderTimelineDate();
    filterAppointments();
});


document.addEventListener("DOMContentLoaded", function () {
    /* =========================================================
       NOTARY PUBLIC & LEGAL SERVICES
       DOCUMENT UPLOAD FUNCTIONALITY
    ========================================================= */

    const dropzone = document.getElementById("nplDocsDropzone");
    const fileInput = document.getElementById("nplDocsFileInput");
    const selectedFilesContainer = document.getElementById("nplDocsSelectedFiles");

    if (!dropzone || !fileInput || !selectedFilesContainer) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    const ALLOWED_EXTENSIONS = [
        "pdf",
        "doc",
        "docx",
        "jpg",
        "jpeg",
        "png"
    ];

    let selectedFiles = [];

    /* =========================================================
       FILE SIZE FORMATTER
    ========================================================= */

    function formatFileSize(bytes) {
        if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + " KB";
        }

        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }

    /* =========================================================
       FILE ICON
    ========================================================= */

    function getFileIcon(fileName) {
        const extension = fileName.split(".").pop().toLowerCase();

        const icons = {
            pdf: "fa-file-pdf",
            doc: "fa-file-word",
            docx: "fa-file-word",
            jpg: "fa-file-image",
            jpeg: "fa-file-image",
            png: "fa-file-image"
        };

        return icons[extension] || "fa-file";
    }

    /* =========================================================
       VALIDATE FILES
    ========================================================= */

    function validateFile(file) {
        const extension = file.name.split(".").pop().toLowerCase();

        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            return "Unsupported file format.";
        }

        if (file.size === 0) {
            return "This file is empty.";
        }

        if (file.size > MAX_FILE_SIZE) {
            return "File exceeds the 10 MB limit.";
        }

        return "";
    }

    /* =========================================================
       ESCAPE FILE NAMES
    ========================================================= */

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, function (character) {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return entities[character];
        });
    }

    /* =========================================================
       FILE SELECTION
    ========================================================= */

    function handleFiles(files) {
        const errors = [];

        Array.from(files).forEach(function (file) {
            const error = validateFile(file);

            if (error) {
                errors.push(file.name + ": " + error);
                return;
            }

            const alreadyExists = selectedFiles.some(function (item) {
                return (
                    item.file.name === file.name &&
                    item.file.size === file.size &&
                    item.file.lastModified === file.lastModified
                );
            });

            if (alreadyExists) {
                errors.push(file.name + ": File already selected.");
                return;
            }

            selectedFiles.push({
                id: createFileId(),
                file: file
            });
        });

        renderSelectedFiles();

        if (errors.length) {
            showUploadMessage(errors.join("\n"), "error");
        }
    }

    /* =========================================================
       UNIQUE FILE ID
    ========================================================= */

    function createFileId() {
        return "npl-doc-" +
            Date.now().toString(36) +
            "-" +
            Math.random().toString(36).slice(2, 10);
    }

    /* =========================================================
       RENDER SELECTED FILES
    ========================================================= */

    function renderSelectedFiles() {
        selectedFilesContainer.innerHTML = "";

        if (selectedFiles.length === 0) {
            selectedFilesContainer.hidden = true;
            return;
        }

        selectedFilesContainer.hidden = false;

        const heading = document.createElement("div");
        heading.className = "npl-docs-selected-heading";

        heading.innerHTML = `
            <strong>
                Selected Files
                <span>(${selectedFiles.length})</span>
            </strong>
            <button
                type="button"
                class="npl-docs-clear-files"
                aria-label="Remove all selected files"
            >
                Clear all
            </button>
        `;

        selectedFilesContainer.appendChild(heading);

        const fileList = document.createElement("div");
        fileList.className = "npl-docs-selected-list";

        selectedFiles.forEach(function (item) {
            const file = item.file;
            const fileElement = document.createElement("div");

            fileElement.className = "npl-docs-selected-file";
            fileElement.dataset.fileId = item.id;

            fileElement.innerHTML = `
                <span class="npl-docs-selected-file-icon">
                    <i class="fa-solid ${getFileIcon(file.name)}"
                       aria-hidden="true"></i>
                </span>

                <span class="npl-docs-selected-file-info">
                    <strong title="${escapeHTML(file.name)}">
                        ${escapeHTML(file.name)}
                    </strong>
                    <small>${formatFileSize(file.size)}</small>
                </span>

                <button
                    type="button"
                    class="npl-docs-remove-file"
                    data-file-id="${escapeHTML(item.id)}"
                    aria-label="Remove ${escapeHTML(file.name)}"
                    title="Remove file"
                >
                    <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                </button>
            `;

            fileList.appendChild(fileElement);
        });

        selectedFilesContainer.appendChild(fileList);

        const uploadButton = document.createElement("button");
        uploadButton.type = "button";
        uploadButton.className = "npl-docs-btn npl-docs-btn-primary npl-docs-upload-submit";

        uploadButton.innerHTML = `
            <i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i>
            Upload ${selectedFiles.length === 1 ? "File" : "Files"}
        `;

        selectedFilesContainer.appendChild(uploadButton);
    }

    /* =========================================================
       REMOVE INDIVIDUAL FILES / CLEAR ALL
    ========================================================= */

    selectedFilesContainer.addEventListener("click", function (event) {
        const removeButton = event.target.closest(".npl-docs-remove-file");
        const clearButton = event.target.closest(".npl-docs-clear-files");
        const uploadButton = event.target.closest(".npl-docs-upload-submit");

        if (removeButton) {
            const fileId = removeButton.dataset.fileId;

            selectedFiles = selectedFiles.filter(function (item) {
                return item.id !== fileId;
            });

            renderSelectedFiles();
        }

        if (clearButton) {
            selectedFiles = [];
            fileInput.value = "";
            renderSelectedFiles();
            showUploadMessage("All selected files have been cleared.", "success");
        }

        if (uploadButton) {
            uploadSelectedFiles();
        }
    });

    /* =========================================================
       FILE INPUT CHANGE
    ========================================================= */

    fileInput.addEventListener("change", function () {
        handleFiles(fileInput.files);

        // Allows selecting the same file again after removal.
        fileInput.value = "";
    });

    /* =========================================================
       DRAG AND DROP
    ========================================================= */

    ["dragenter", "dragover"].forEach(function (eventName) {
        dropzone.addEventListener(eventName, function (event) {
            event.preventDefault();
            event.stopPropagation();

            dropzone.classList.add("is-dragging");
        });
    });

    ["dragleave", "dragend"].forEach(function (eventName) {
        dropzone.addEventListener(eventName, function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (!dropzone.contains(event.relatedTarget)) {
                dropzone.classList.remove("is-dragging");
            }
        });
    });

    dropzone.addEventListener("drop", function (event) {
        event.preventDefault();
        event.stopPropagation();

        dropzone.classList.remove("is-dragging");

        if (event.dataTransfer && event.dataTransfer.files) {
            handleFiles(event.dataTransfer.files);
        }
    });

    /* =========================================================
       ACCESSIBLE KEYBOARD SUPPORT
    ========================================================= */

    dropzone.setAttribute("tabindex", "0");
    dropzone.setAttribute("role", "button");
    dropzone.setAttribute("aria-label", "Choose or drop documents to upload");

    dropzone.addEventListener("keydown", function (event) {
        if (event.target !== dropzone) return;

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            fileInput.click();
        }
    });

    /* =========================================================
       UPLOAD MESSAGE
    ========================================================= */

    function showUploadMessage(message, type) {
        let messageElement = document.getElementById("nplDocsUploadMessage");

        if (!messageElement) {
            messageElement = document.createElement("div");
            messageElement.id = "nplDocsUploadMessage";
            messageElement.className = "npl-docs-upload-message";

            selectedFilesContainer.insertAdjacentElement(
                "afterend",
                messageElement
            );
        }

        messageElement.className =
            "npl-docs-upload-message is-" + type;

        messageElement.setAttribute("role", type === "error" ? "alert" : "status");
        messageElement.textContent = message;
        messageElement.style.whiteSpace = "pre-line";
    }

    /* =========================================================
       UPLOAD ACTION
       Connect this function to your backend API.
    ========================================================= */

    async function uploadSelectedFiles() {
        if (selectedFiles.length === 0) {
            showUploadMessage("Please select at least one file.", "error");
            return;
        }

        /*
         * Frontend selection and validation are complete.
         * Actual storage requires a server/API endpoint.
         *
         * Replace the endpoint below with your real upload API.
         */

        const uploadEndpoint = "/api/documents/upload";

        const formData = new FormData();

        selectedFiles.forEach(function (item) {
            formData.append("documents", item.file);
        });

        const uploadButton = selectedFilesContainer.querySelector(
            ".npl-docs-upload-submit"
        );

        if (!uploadButton) return;

        const originalButtonContent = uploadButton.innerHTML;

        uploadButton.disabled = true;
        uploadButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
            Uploading...
        `;

        try {
            const response = await fetch(uploadEndpoint, {
                method: "POST",
                body: formData,
                credentials: "same-origin"
            });

            if (!response.ok) {
                throw new Error("The server could not upload the documents.");
            }

            selectedFiles = [];
            renderSelectedFiles();

            showUploadMessage(
                "Documents uploaded successfully.",
                "success"
            );
        } catch (error) {
            console.error("Document upload failed:", error);

            showUploadMessage(
                "Upload could not be completed. Please check your connection and try again.",
                "error"
            );

            uploadButton.disabled = false;
            uploadButton.innerHTML = originalButtonContent;
        }
    }
});



/* =========================================
   NOTARY SERVICES PAGE INTERACTIONS
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("nplNotaryModal");
    const openButton = document.getElementById("nplNotaryNewRequest");
    const requestForm = document.getElementById("nplNotaryRequestForm");
    const searchInput = document.getElementById("nplNotarySearch");
    const statusFilter = document.getElementById("nplNotaryStatusFilter");
    const tableBody = document.getElementById("nplNotaryRequestsBody");
    const emptyState = document.getElementById("nplNotaryEmptyState");
    const visibleCount = document.getElementById("nplNotaryVisibleCount");
    const formMessage = document.getElementById("nplNotaryFormMessage");

    if (!modal || !requestForm || !tableBody) return;

    let requestNumber = 1025;
    let previousFocus = null;

    function openModal() {
        previousFocus = document.activeElement;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("npl-notary-modal-open");

        const firstInput = modal.querySelector("input");
        if (firstInput) firstInput.focus();
    }

    function closeModal() {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("npl-notary-modal-open");

        if (previousFocus) previousFocus.focus();
    }

    if (openButton) {
        openButton.addEventListener("click", openModal);
    }

    modal.querySelectorAll("[data-notary-close]").forEach(function (element) {
        element.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && modal.classList.contains("is-open")) {
            closeModal();
        }
    });

    function filterRequests() {
        const query = (searchInput?.value || "").trim().toLowerCase();
        const selectedStatus = statusFilter?.value || "all";
        let count = 0;

        tableBody.querySelectorAll("tr").forEach(function (row) {
            const text = row.textContent.toLowerCase();
            const matchesSearch = text.includes(query);
            const matchesStatus =
                selectedStatus === "all" ||
                row.dataset.status === selectedStatus;

            const visible = matchesSearch && matchesStatus;
            row.hidden = !visible;

            if (visible) count++;
        });

        if (visibleCount) visibleCount.textContent = count;
        if (emptyState) emptyState.hidden = count !== 0;
    }

    searchInput?.addEventListener("input", filterRequests);
    statusFilter?.addEventListener("change", filterRequests);

    requestForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!requestForm.reportValidity()) return;

        const formData = new FormData(requestForm);
        const clientName = String(formData.get("clientName") || "").trim();
        const clientEmail = String(formData.get("clientEmail") || "").trim();
        const serviceType = String(formData.get("serviceType") || "");
        const priority = String(formData.get("priority") || "Medium");

        if (!clientName || !clientEmail || !serviceType) return;

        const id = "NOT-" + requestNumber++;
        const initials = clientName
            .split(/\s+/)
            .slice(0, 2)
            .map(function (part) {
                return part.charAt(0).toUpperCase();
            })
            .join("");

        const row = document.createElement("tr");
        row.dataset.status = "Pending";

        // Use DOM text nodes for user-provided values.
        const values = [
            id,
            clientName,
            clientEmail,
            serviceType,
            new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            })
        ];

        const idCell = document.createElement("td");
        const idLabel = document.createElement("span");
        idLabel.className = "npl-notary-request-id";
        idLabel.textContent = values[0];
        idCell.appendChild(idLabel);

        const clientCell = document.createElement("td");
        const client = document.createElement("div");
        client.className = "npl-notary-client";

        const avatar = document.createElement("span");
        avatar.className = "npl-notary-client-avatar npl-notary-avatar-one";
        avatar.textContent = initials;

        const clientInfo = document.createElement("span");
        const name = document.createElement("strong");
        name.textContent = values[1];

        const email = document.createElement("small");
        email.textContent = values[2];

        clientInfo.append(name, email);
        client.append(avatar, clientInfo);
        clientCell.appendChild(client);

        const serviceCell = document.createElement("td");
        serviceCell.textContent = values[3];

        const dateCell = document.createElement("td");
        dateCell.textContent = values[4];

        const priorityCell = document.createElement("td");
        const priorityLabel = document.createElement("span");
        const priorityDot = document.createElement("span");

        priorityLabel.className = "npl-notary-priority";
        priorityLabel.classList.add(
            priority === "High"
                ? "npl-notary-priority-high"
                : priority === "Low"
                    ? "npl-notary-priority-low"
                    : "npl-notary-priority-medium"
        );

        priorityLabel.appendChild(priorityDot);
        priorityLabel.appendChild(document.createTextNode(" " + priority));
        priorityCell.appendChild(priorityLabel);

        const statusCell = document.createElement("td");
        const statusLabel = document.createElement("span");
        statusLabel.className = "npl-notary-status npl-notary-status-pending";
        statusLabel.textContent = "Pending";
        statusCell.appendChild(statusLabel);

        const actionCell = document.createElement("td");
        const actionButton = document.createElement("button");
        actionButton.type = "button";
        actionButton.className = "npl-notary-row-action";
        actionButton.dataset.request = id;
        actionButton.setAttribute("aria-label", "View request " + id);

        const actionIcon = document.createElement("i");
        actionIcon.className = "fa-solid fa-arrow-up-right-from-square";
        actionButton.appendChild(actionIcon);
        actionCell.appendChild(actionButton);

        row.append(
            idCell,
            clientCell,
            serviceCell,
            dateCell,
            priorityCell,
            statusCell,
            actionCell
        );

        tableBody.prepend(row);

        requestForm.reset();
        if (formMessage) formMessage.hidden = true;

        if (searchInput) searchInput.value = "";
        if (statusFilter) statusFilter.value = "all";

        filterRequests();
        closeModal();
    });

    // Demo action: connect these buttons to a real request detail page.
    tableBody.addEventListener("click", function (event) {
        const button = event.target.closest(".npl-notary-row-action");
        if (!button) return;

        const requestId = button.dataset.request;
        console.info("Selected notary request:", requestId);

        // Replace this with a detail page or request-view modal.
    });

    filterRequests();
});


document.addEventListener("DOMContentLoaded", function () {
    /* ==========================================
       NPL PAYMENTS - REVENUE CHART
    ========================================== */

    const periodDropdown = document.getElementById("nplPaymentsPeriod");
    const chartContainer = document.getElementById("nplPaymentsChart");
    const chartTotal = document.getElementById("nplPaymentsChartTotal");

    if (!periodDropdown || !chartContainer || !chartTotal) {
        return;
    }

    // Illustrative monthly revenue data
    const revenueData = [
        { month: "Nov", revenue: 68000 },
        { month: "Dec", revenue: 74000 },
        { month: "Jan", revenue: 79000 },
        { month: "Feb", revenue: 86000 },
        { month: "Mar", revenue: 92000 },
        { month: "Apr", revenue: 88000 },
        { month: "May", revenue: 82000 },
        { month: "Jun", revenue: 96000 },
        { month: "Jul", revenue: 110000 },
        { month: "Aug", revenue: 100000 },
        { month: "Sep", revenue: 130000 },
        { month: "Oct", revenue: 150000 }
    ];

    // Format amounts in Indian currency style
    function formatRevenue(amount) {
        if (amount >= 100000) {
            return "₹" + (amount / 100000).toFixed(2).replace(/\.?0+$/, "") + "L";
        }

        return "₹" + Math.round(amount / 1000) + "K";
    }

    // Render the chart for the selected period
    function renderRevenueChart() {
        const selectedPeriod = Number(periodDropdown.value);
        const selectedData = revenueData.slice(-selectedPeriod);

        const totalRevenue = selectedData.reduce(function (total, item) {
            return total + item.revenue;
        }, 0);

        const maxRevenue = Math.max(
            ...selectedData.map(function (item) {
                return item.revenue;
            })
        );

        // Update the total collected revenue
        chartTotal.textContent = formatRevenue(totalRevenue);

        // Update chart accessibility description
        chartContainer.setAttribute(
            "aria-label",
            "Monthly revenue bar chart showing the last " +
            selectedPeriod +
            " months"
        );

        // Rebuild the chart bars
        chartContainer.innerHTML = "";

        selectedData.forEach(function (item, index) {
            const column = document.createElement("div");
            column.className = "npl-payments-chart-column";

            if (index === selectedData.length - 1) {
                column.classList.add("npl-payments-bar-current");
            }

            const value = document.createElement("span");
            value.className = "npl-payments-chart-value";
            value.textContent = formatRevenue(item.revenue);

            const bar = document.createElement("div");
            bar.className = "npl-payments-bar";

            // Keep bars proportional while leaving room for labels
            const height = Math.max(
                12,
                Math.round((item.revenue / maxRevenue) * 88)
            );

            bar.style.setProperty("--bar-height", height + "%");
            bar.style.height = height + "%";

            const month = document.createElement("span");
            month.className = "npl-payments-chart-month";
            month.textContent = item.month;

            column.appendChild(value);
            column.appendChild(bar);
            column.appendChild(month);

            chartContainer.appendChild(column);
        });

        // Re-trigger the bar animation
        const bars = chartContainer.querySelectorAll(".npl-payments-bar");

        bars.forEach(function (bar, index) {
            bar.style.animation = "none";
            void bar.offsetWidth;

            bar.style.animation = "nplRevenueBarGrow 0.7s ease forwards";
            bar.style.animationDelay = index * 0.06 + "s";
        });
    }

    // Update chart whenever the period changes
    periodDropdown.addEventListener("change", renderRevenueChart);

    // Display the initial chart
    renderRevenueChart();
});


 document.addEventListener("DOMContentLoaded", function () {

    const nameInput = document.getElementById("nplSettingsName");

    if (!nameInput) return;

    // Get the logged-in admin's name from localStorage
    const adminName =
        localStorage.getItem("adminName") ||
        localStorage.getItem("loginName") ||
        localStorage.getItem("userName") ||
        "";

    const adminEmail =
        localStorage.getItem("loginEmail") ||
        localStorage.getItem("adminEmail") ||
        "";

    if (adminName) {
        nameInput.value = adminName;
    } else if (adminEmail.includes("@")) {
        // Use the email username if a name is not saved
        const emailName = adminEmail.split("@")[0];
        const firstName = emailName.split(/[._\-\s]+/)[0];

        nameInput.value = firstName
            ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
            : "";
    }

});



document.addEventListener("DOMContentLoaded", function () {

    const emailInput = document.getElementById("nplSettingsEmail");

    if (!emailInput) return;

    const adminEmail =
        localStorage.getItem("loginEmail") ||
        localStorage.getItem("adminEmail") ||
        "";

    if (adminEmail) {
        emailInput.value = adminEmail;
    }

});



/* =========================================================
   STACKLY LEGAL — ADMIN ACCOUNT SETTINGS
   Load Profile | Update Profile | Reset Form | Local Storage
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const nameInput = document.getElementById("nplSettingsName");
    const emailInput = document.getElementById("nplSettingsEmail");
    const phoneInput = document.getElementById("nplSettingsPhone");
    const roleInput = document.getElementById("nplSettingsRole");

    if (!nameInput || !emailInput || !phoneInput || !roleInput) {
        return;
    }

    const form = nameInput.closest("form");
    if (!form) return;

    const updateButton = form.querySelector(".npl-settings-primary-btn");
    const resetButton = form.querySelector(".npl-settings-reset-btn");

    // Profile storage keys
    const PROFILE_KEY = "nplAdminProfile";

    // Load existing profile
    function loadProfile() {
        let savedProfile = {};

        try {
            savedProfile = JSON.parse(
                localStorage.getItem(PROFILE_KEY) || "{}"
            );
        } catch (error) {
            savedProfile = {};
        }

        const loginEmail =
            localStorage.getItem("loginEmail") ||
            localStorage.getItem("adminEmail") ||
            "";

        const loginName =
            localStorage.getItem("adminName") ||
            localStorage.getItem("loginName") ||
            localStorage.getItem("userName") ||
            "";

        nameInput.value =
            savedProfile.name ||
            loginName ||
            getNameFromEmail(loginEmail);

        emailInput.value =
            savedProfile.email ||
            loginEmail;

        phoneInput.value =
            savedProfile.phone || "";

        roleInput.value = "Administrator";
    }

    // Derive a display name from email when no name is saved
    function getNameFromEmail(email) {
        if (!email || !email.includes("@")) {
            return "";
        }

        const firstName = email
            .split("@")[0]
            .split(/[._\-\s]+/)[0];

        return firstName
            ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
            : "";
    }

    // Save updated profile
    function updateProfile() {

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();

        if (!name) {
            alert("Please enter your full name.");
            nameInput.focus();
            return;
        }

        if (!email || !emailInput.validity.valid) {
            alert("Please enter a valid email address.");
            emailInput.focus();
            return;
        }

        const profile = {
            name: name,
            email: email,
            phone: phone,
            role: "Administrator"
        };

        try {
            localStorage.setItem(
                PROFILE_KEY,
                JSON.stringify(profile)
            );

            // Keep shared login details synchronized
            localStorage.setItem("adminName", name);
            localStorage.setItem("loginEmail", email);
            localStorage.setItem("adminEmail", email);

            // Update dashboard header, if present
            const headerName =
                document.getElementById("nplAdminUserName");

            const headerEmail =
                document.getElementById("nplAdminUserEmail");

            if (headerName) {
                headerName.textContent = name;
            }

            if (headerEmail) {
                headerEmail.textContent = email;
                headerEmail.href = "mailto:" + email;
            }

            // Update the dashboard avatar, if present
            const avatar = document.querySelector(".npl-admin-avatar");

            if (avatar) {
                avatar.textContent = name.charAt(0).toUpperCase();
            }

            showProfileMessage("Profile updated successfully.", "success");

        } catch (error) {
            showProfileMessage(
                "Unable to save your profile. Please try again.",
                "error"
            );
        }
    }

    // Reset fields to the last saved profile
    function resetProfile() {
        loadProfile();
        showProfileMessage("Saved profile details restored.", "success");
    }

    // Display a feedback message without repeated alert popups
    function showProfileMessage(message, type) {

        let feedback = document.getElementById("nplSettingsFeedback");

        if (!feedback) {
            feedback = document.createElement("p");
            feedback.id = "nplSettingsFeedback";
            feedback.setAttribute("role", "status");
            feedback.setAttribute("aria-live", "polite");

            feedback.style.margin = "15px 0 0";
            feedback.style.fontSize = "14px";
            feedback.style.fontWeight = "600";

            form.appendChild(feedback);
        }

        feedback.textContent = message;
        feedback.style.color =
            type === "success" ? "#236b45" : "#b42318";
    }

    // Prevent browser reset from clearing the loaded profile
    form.addEventListener("reset", function (event) {
        event.preventDefault();
        resetProfile();
    });

    if (updateButton) {
        updateButton.addEventListener("click", updateProfile);
    }

    if (resetButton) {
        resetButton.addEventListener("click", resetProfile);
    }

    // Initialize profile fields
    loadProfile();

});
