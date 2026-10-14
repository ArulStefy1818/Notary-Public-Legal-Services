
/* =====================================================
   STACKLY NOTARY PUBLIC & LEGAL SERVICES
   MAIN JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    /* =================================================
       ELEMENT SELECTORS
    ================================================= */

    const stacklyLegalHeader =
        document.getElementById("stacklyLegalHeader");

    const stacklyLegalMenuToggle =
        document.getElementById("stacklyLegalMenuToggle");

    const stacklyLegalMenuClose =
        document.getElementById("stacklyLegalMenuClose");

    const stacklyLegalMobileMenu =
        document.getElementById("stacklyLegalMobileMenu");

    const stacklyLegalMobileOverlay =
        document.getElementById("stacklyLegalMobileOverlay");

    const stacklyLegalSearchToggle =
        document.getElementById("stacklyLegalSearchToggle");

    const stacklyLegalSearchPanel =
        document.getElementById("stacklyLegalSearchPanel");

    const stacklyLegalSearchInput =
        document.getElementById("stacklyLegalSearchInput");

    const stacklyLegalHeroTitle =
        document.getElementById("stacklyLegalHeroTitle");

    const stacklyLegalHeroDescription =
        document.getElementById("stacklyLegalHeroDescription");

    const stacklyLegalCurrentSlide =
        document.getElementById("stacklyLegalCurrentSlide");

    const stacklyLegalSliderNext =
        document.getElementById("stacklyLegalSliderNext");

    const stacklyLegalYear =
        document.getElementById("stacklyLegalYear");


    /* =================================================
       CURRENT YEAR
    ================================================= */

    if (stacklyLegalYear) {
        stacklyLegalYear.textContent =
            new Date().getFullYear();
    }


    /* =================================================
       HEADER SCROLL EFFECT
    ================================================= */

    function stacklyLegalUpdateHeader() {

        if (!stacklyLegalHeader) return;

        stacklyLegalHeader.classList.toggle(
            "scrolled",
            window.scrollY > 30
        );

    }

    stacklyLegalUpdateHeader();

    window.addEventListener(
        "scroll",
        stacklyLegalUpdateHeader,
        { passive: true }
    );


    /* =================================================
       MOBILE NAVIGATION
    ================================================= */

    let stacklyLegalLastFocusedElement = null;

    function stacklyLegalOpenMenu() {

        if (!stacklyLegalMobileMenu) return;

        stacklyLegalLastFocusedElement =
            document.activeElement;

        stacklyLegalMobileMenu.inert = false;

        stacklyLegalMobileMenu.setAttribute(
            "aria-hidden",
            "false"
        );

        stacklyLegalMobileMenu.classList.add("open");

        if (stacklyLegalMobileOverlay) {
            stacklyLegalMobileOverlay.classList.add("open");
        }

        if (stacklyLegalMenuToggle) {
            stacklyLegalMenuToggle.setAttribute(
                "aria-expanded",
                "true"
            );
        }

        document.body.classList.add(
            "stackly-legal-menu-open"
        );

        if (stacklyLegalSearchPanel) {
            stacklyLegalSearchPanel.classList.remove("open");
        }

        if (stacklyLegalSearchToggle) {
            stacklyLegalSearchToggle.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        if (stacklyLegalMenuClose) {
            stacklyLegalMenuClose.focus();
        }

    }


    function stacklyLegalCloseMenu(restoreFocus = true) {

        if (!stacklyLegalMobileMenu) return;

        stacklyLegalMobileMenu.classList.remove("open");

        if (stacklyLegalMobileOverlay) {
            stacklyLegalMobileOverlay.classList.remove("open");
        }

        if (stacklyLegalMenuToggle) {
            stacklyLegalMenuToggle.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        stacklyLegalMobileMenu.setAttribute(
            "aria-hidden",
            "true"
        );

        stacklyLegalMobileMenu.inert = true;

        document.body.classList.remove(
            "stackly-legal-menu-open"
        );

        if (
            restoreFocus &&
            stacklyLegalLastFocusedElement &&
            typeof stacklyLegalLastFocusedElement.focus === "function"
        ) {
            stacklyLegalLastFocusedElement.focus();
        }

    }


    if (stacklyLegalMenuToggle) {

        stacklyLegalMenuToggle.addEventListener(
            "click",
            stacklyLegalOpenMenu
        );

    }


    if (stacklyLegalMenuClose) {

        stacklyLegalMenuClose.addEventListener(
            "click",
            function () {
                stacklyLegalCloseMenu(true);
            }
        );

    }


    if (stacklyLegalMobileOverlay) {

        stacklyLegalMobileOverlay.addEventListener(
            "click",
            function () {
                stacklyLegalCloseMenu(true);
            }
        );

    }


    /* Close menu when a mobile navigation link is clicked */

    if (stacklyLegalMobileMenu) {

        const stacklyLegalMobileLinks =
            stacklyLegalMobileMenu.querySelectorAll("a");

        stacklyLegalMobileLinks.forEach(function (link) {

            link.addEventListener("click", function () {
                stacklyLegalCloseMenu(false);
            });

        });

    }


    /* Close menu with Escape and maintain focus visibility */

    document.addEventListener("keydown", function (event) {

        if (
            event.key === "Escape" &&
            stacklyLegalMobileMenu &&
            stacklyLegalMobileMenu.classList.contains("open")
        ) {
            stacklyLegalCloseMenu(true);
            return;
        }

        if (
            event.key === "Escape" &&
            stacklyLegalSearchPanel &&
            stacklyLegalSearchPanel.classList.contains("open")
        ) {

            stacklyLegalSearchPanel.classList.remove("open");

            if (stacklyLegalSearchToggle) {
                stacklyLegalSearchToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                stacklyLegalSearchToggle.focus();
            }

        }

    });


    /* Close the mobile menu when returning to desktop layout */

    window.addEventListener("resize", function () {

        if (
            window.innerWidth > 900 &&
            stacklyLegalMobileMenu &&
            stacklyLegalMobileMenu.classList.contains("open")
        ) {
            stacklyLegalCloseMenu(false);
        }

    });


    /* =================================================
       SEARCH PANEL
    ================================================= */

    if (stacklyLegalSearchToggle && stacklyLegalSearchPanel) {

        stacklyLegalSearchToggle.addEventListener(
            "click",
            function () {

                const isOpen =
                    stacklyLegalSearchPanel.classList.contains("open");

                if (
                    stacklyLegalMobileMenu &&
                    stacklyLegalMobileMenu.classList.contains("open")
                ) {
                    stacklyLegalCloseMenu(false);
                }

                stacklyLegalSearchPanel.classList.toggle(
                    "open",
                    !isOpen
                );

                stacklyLegalSearchToggle.setAttribute(
                    "aria-expanded",
                    String(!isOpen)
                );

                if (!isOpen && stacklyLegalSearchInput) {
                    stacklyLegalSearchInput.focus();
                }

            }
        );

    }


    /* =================================================
       THREE-VIDEO HERO SLIDER
    ================================================= */

    const stacklyLegalVideos = [
        document.getElementById("stacklyLegalVideoOne"),
        document.getElementById("stacklyLegalVideoTwo"),
        document.getElementById("stacklyLegalVideoThree")
    ].filter(Boolean);


    const stacklyLegalSliderDots =
        document.querySelectorAll(".stackly-legal-slider-dot");


    const stacklyLegalSlides = [

        {
            title: "Your Partner In|Legal Success",
            description:
                "Professional notary public services and reliable legal documentation, delivered with accuracy, confidentiality, and care."
        },

        {
            title: "Documents Done|With Confidence",
            description:
                "Get assistance with affidavits, declarations, document attestation, and essential paperwork through a clear and dependable process."
        },

        {
            title: "Integrity In Every|Legal Detail",
            description:
                "Make important documentation simpler with attentive service, careful preparation, and guidance on the applicable requirements."
        }

    ];


    let stacklyLegalActiveSlide = 0;

    let stacklyLegalSliderTimer = null;

    const stacklyLegalSliderInterval = 7000;


    /* Respect the visitor's motion preference */

    const stacklyLegalReducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;


    function stacklyLegalRenderTitle(titleText) {

        if (!stacklyLegalHeroTitle) return;

        const titleParts = titleText.split("|");

        stacklyLegalHeroTitle.replaceChildren();

        stacklyLegalHeroTitle.appendChild(
            document.createTextNode(titleParts[0] || "")
        );

        if (titleParts[1]) {

            const secondLine = document.createElement("span");

            secondLine.textContent = titleParts[1].trim();

            stacklyLegalHeroTitle.appendChild(secondLine);

        }

    }


    function stacklyLegalShowSlide(index) {

        if (!stacklyLegalVideos.length) return;

        stacklyLegalActiveSlide =
            (index + stacklyLegalVideos.length) %
            stacklyLegalVideos.length;

        stacklyLegalVideos.forEach(function (video, videoIndex) {

            const isActive =
                videoIndex === stacklyLegalActiveSlide;

            video.classList.toggle("active", isActive);

            if (isActive) {

                video.setAttribute("aria-hidden", "false");

                if (video.readyState >= 2) {
                    video.play().catch(function () {
                        /* Poster remains available if playback is blocked. */
                    });
                } else {
                    video.play().catch(function () {
                        /* Autoplay may be restricted by the browser. */
                    });
                }

            } else {

                video.setAttribute("aria-hidden", "true");
                video.pause();

            }

        });


        const slideContent =
            stacklyLegalSlides[stacklyLegalActiveSlide];

        if (slideContent) {

            stacklyLegalRenderTitle(slideContent.title);

            if (stacklyLegalHeroDescription) {
                stacklyLegalHeroDescription.textContent =
                    slideContent.description;
            }

        }


        if (stacklyLegalCurrentSlide) {

            stacklyLegalCurrentSlide.textContent =
                String(stacklyLegalActiveSlide + 1).padStart(2, "0");

        }


        stacklyLegalSliderDots.forEach(function (dot, dotIndex) {

            const isActive =
                dotIndex === stacklyLegalActiveSlide;

            dot.classList.toggle("active", isActive);

            dot.setAttribute(
                "aria-pressed",
                String(isActive)
            );

        });

    }


    function stacklyLegalStopSlider() {

        if (stacklyLegalSliderTimer !== null) {

            window.clearInterval(stacklyLegalSliderTimer);

            stacklyLegalSliderTimer = null;

        }

    }


    function stacklyLegalStartSlider() {

        stacklyLegalStopSlider();

        if (
            stacklyLegalReducedMotion ||
            document.hidden ||
            stacklyLegalVideos.length < 2
        ) {
            return;
        }

        stacklyLegalSliderTimer = window.setInterval(
            function () {

                stacklyLegalShowSlide(
                    stacklyLegalActiveSlide + 1
                );

            },
            stacklyLegalSliderInterval
        );

    }


    /* Slider dots */

    stacklyLegalSliderDots.forEach(function (dot) {

        dot.addEventListener("click", function () {

            const slideIndex =
                Number(dot.getAttribute("data-slide"));

            if (!Number.isInteger(slideIndex)) return;

            stacklyLegalShowSlide(slideIndex);
            stacklyLegalStartSlider();

        });

    });


    /* Next slide button */

    if (stacklyLegalSliderNext) {

        stacklyLegalSliderNext.addEventListener(
            "click",
            function () {

                stacklyLegalShowSlide(
                    stacklyLegalActiveSlide + 1
                );

                stacklyLegalStartSlider();

            }
        );

    }


    /* Pause autoplay while the tab is not visible */

    document.addEventListener("visibilitychange", function () {

        if (document.hidden) {

            stacklyLegalStopSlider();

            stacklyLegalVideos.forEach(function (video) {
                video.pause();
            });

        } else {

            stacklyLegalShowSlide(stacklyLegalActiveSlide);
            stacklyLegalStartSlider();

        }

    });


    /* Pause autoplay when the hero is out of view */

    const stacklyLegalHero =
        document.getElementById("stacklyLegalHero");

    let stacklyLegalHeroIsVisible = true;

    if ("IntersectionObserver" in window && stacklyLegalHero) {

        const stacklyLegalHeroObserver =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(function (entry) {

                        stacklyLegalHeroIsVisible =
                            entry.isIntersecting;

                        if (!entry.isIntersecting) {

                            stacklyLegalStopSlider();

                            stacklyLegalVideos.forEach(function (video) {
                                video.pause();
                            });

                        } else if (!document.hidden) {

                            stacklyLegalShowSlide(
                                stacklyLegalActiveSlide
                            );

                            stacklyLegalStartSlider();

                        }

                    });

                },
                { threshold: 0.1 }
            );

        stacklyLegalHeroObserver.observe(stacklyLegalHero);

    }


    /* Keep slider timing aligned with hero visibility */

    const stacklyLegalOriginalStartSlider =
        stacklyLegalStartSlider;

    stacklyLegalStartSlider = function () {

        stacklyLegalStopSlider();

        if (
            !stacklyLegalHeroIsVisible ||
            document.hidden ||
            stacklyLegalReducedMotion ||
            stacklyLegalVideos.length < 2
        ) {
            return;
        }

        stacklyLegalSliderTimer = window.setInterval(
            function () {

                stacklyLegalShowSlide(
                    stacklyLegalActiveSlide + 1
                );

            },
            stacklyLegalSliderInterval
        );

    };


    /* Initialize the first slide */

    if (stacklyLegalVideos.length > 0) {

        stacklyLegalShowSlide(0);

        stacklyLegalStartSlider();

    }


    /* =================================================
       AOS SCROLL ANIMATIONS
    ================================================= */

    if (typeof AOS !== "undefined") {

        AOS.init({
            duration: 900,
            once: true,
            offset: 70,
            easing: "ease-out-cubic",
            disable: stacklyLegalReducedMotion
        });

    }

});



(function () {
    "use strict";

    const section = document.querySelector("#testimonials");

    if (!section || section.dataset.sliderInitialized === "true") {
        return;
    }

    section.dataset.sliderInitialized = "true";

    const slides = Array.from(
        section.querySelectorAll(".npl-testimonial-slide")
    );

    const previousButton = section.querySelector(
        "#nplTestimonialPrev"
    );

    const nextButton = section.querySelector(
        "#nplTestimonialNext"
    );

    const currentCounter = section.querySelector(
        "#nplTestimonialCurrent"
    );

    const totalCounter = section.querySelector(
        "#nplTestimonialTotal"
    );

    if (
        !slides.length ||
        !previousButton ||
        !nextButton ||
        !currentCounter ||
        !totalCounter
    ) {
        return;
    }

    let currentIndex = 0;

    totalCounter.textContent = String(slides.length).padStart(2, "0");

    function showTestimonial(index) {
        currentIndex = (index + slides.length) % slides.length;

        slides.forEach(function (slide, i) {
            const isActive = i === currentIndex;

            slide.classList.toggle("is-active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
        });

        currentCounter.textContent = String(
            currentIndex + 1
        ).padStart(2, "0");
    }

    previousButton.addEventListener("click", function () {
        showTestimonial(currentIndex - 1);
    });

    nextButton.addEventListener("click", function () {
        showTestimonial(currentIndex + 1);
    });

    showTestimonial(0);
})();


/* ==========================================
   NPL FOOTER NEWSLETTER VALIDATION
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const newsletterForm = document.getElementById("nplFooterNewsletter");
    const newsletterEmail = document.getElementById("nplFooterEmail");
    const newsletterMessage = document.getElementById("nplFooterNewsletterMessage");

    if (!newsletterForm || !newsletterEmail || !newsletterMessage) return;

    let messageTimer;

    newsletterForm.addEventListener("submit", function (event) {
        event.preventDefault();

        clearTimeout(messageTimer);

        const email = newsletterEmail.value.trim();

        // Check empty email
        if (email === "") {
            showNewsletterMessage("Please enter your email address.", "error");
            newsletterEmail.focus();
            return;
        }

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!emailPattern.test(email)) {
            showNewsletterMessage("Please enter a valid email address.", "error");
            newsletterEmail.focus();
            return;
        }

        // Successful client-side validation
        showNewsletterMessage(
            "Thank you for subscribing successfully!",
            "success"
        );

        // Clear the email field
        newsletterForm.reset();

        // Hide the message after 4 seconds
        messageTimer = setTimeout(function () {
            newsletterMessage.innerHTML =
                '<i class="fa-solid fa-lock" aria-hidden="true"></i> ' +
                'Your information will be handled with care.';

            newsletterMessage.classList.remove(
                "npl-footer-message-error",
                "npl-footer-message-success"
            );
        }, 4000);
    });

    // Display newsletter messages
    function showNewsletterMessage(message, type) {
        newsletterMessage.textContent = message;

        newsletterMessage.classList.remove(
            "npl-footer-message-error",
            "npl-footer-message-success"
        );

        newsletterMessage.classList.add(
            type === "error"
                ? "npl-footer-message-error"
                : "npl-footer-message-success"
        );

        newsletterMessage.setAttribute("role", "status");

        // Hide error messages after 4 seconds too
        messageTimer = setTimeout(function () {
            newsletterMessage.innerHTML =
                '<i class="fa-solid fa-lock" aria-hidden="true"></i> ' +
                'Your information will be handled with care.';

            newsletterMessage.classList.remove(
                "npl-footer-message-error",
                "npl-footer-message-success"
            );
        }, 3000);
    }

});


/* ==========================================
   STACKLY LEGAL - ACTIVE PAGE NAVIGATION
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase() || "index.html";

    const allNavLinks = document.querySelectorAll(
        ".stackly-legal-nav-link, .stackly-legal-mobile-link"
    );

    allNavLinks.forEach(function (link) {

        const linkPage = link.getAttribute("href");

        if (!linkPage) return;

        const normalizedLink = linkPage
            .split("/")
            .pop()
            .toLowerCase();

        if (normalizedLink === currentPage) {

            link.classList.add("active");
            link.setAttribute("aria-current", "page");

        } else {

            link.classList.remove("active");
            link.removeAttribute("aria-current");

        }

    });

});



document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================
       CONTACT FORM ELEMENTS
    ========================================== */

    const form = document.getElementById("nplLegalEnquiryForm");

    if (!form) return;

    const nameInput = document.getElementById("nplContactName");
    const emailInput = document.getElementById("nplContactEmail");
    const phoneInput = document.getElementById("nplContactPhone");
    const subjectInput = document.getElementById("nplContactSubject");
    const messageInput = document.getElementById("nplContactMessage");
    const consentInput = document.getElementById("nplContactConsent");

    const dropdown = document.getElementById("nplContactServiceDropdown");
    const trigger = document.getElementById("nplContactServiceTrigger");
    const valueText = document.getElementById("nplContactServiceValue");
    const optionsList = document.getElementById("nplContactServiceOptions");
    const serviceInput = document.getElementById("nplContactServiceInput");
    const serviceError = document.getElementById("nplContactServiceError");

    const statusMessage = document.getElementById("nplContactFormStatus");
    const submitButton = form.querySelector(".npl-contact-submit-btn");

    let statusTimer;
    let isSubmitting = false;

    /* ==========================================
       CUSTOM DROPDOWN
    ========================================== */

    if (dropdown && trigger && optionsList && serviceInput) {

        const options = Array.from(
            optionsList.querySelectorAll('[role="option"]')
        );

        function openDropdown() {
            optionsList.hidden = false;
            dropdown.classList.add("is-open");
            trigger.setAttribute("aria-expanded", "true");
        }

        function closeDropdown() {
            optionsList.hidden = true;
            dropdown.classList.remove("is-open");
            trigger.setAttribute("aria-expanded", "false");
        }

        function selectOption(option) {
            serviceInput.value = option.dataset.value;
            valueText.textContent = option.textContent.trim();

            options.forEach(function (item) {
                const selected = item === option;

                item.classList.toggle("is-selected", selected);
                item.setAttribute("aria-selected", String(selected));
            });

            serviceError.textContent = "";
            trigger.removeAttribute("aria-invalid");

            closeDropdown();
            trigger.focus();
        }

        trigger.addEventListener("click", function () {
            if (optionsList.hidden) {
                openDropdown();
            } else {
                closeDropdown();
            }
        });

        options.forEach(function (option, index) {

            option.addEventListener("click", function () {
                selectOption(option);
            });

            option.addEventListener("keydown", function (event) {

                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectOption(option);
                }

                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    options[(index + 1) % options.length].focus();
                }

                if (event.key === "ArrowUp") {
                    event.preventDefault();
                    options[(index - 1 + options.length) % options.length].focus();
                }

                if (event.key === "Escape") {
                    closeDropdown();
                    trigger.focus();
                }
            });
        });

        trigger.addEventListener("keydown", function (event) {

            if (
                event.key === "ArrowDown" ||
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();

                if (optionsList.hidden) {
                    openDropdown();
                }

                if (options.length) {
                    options[0].focus();
                }
            }

            if (event.key === "Escape") {
                closeDropdown();
            }
        });

        document.addEventListener("click", function (event) {
            if (!dropdown.contains(event.target)) {
                closeDropdown();
            }
        });
    }

    /* ==========================================
       VALIDATION HELPERS
    ========================================== */

    function showFieldError(input, message) {
        input.setCustomValidity(message);
        input.reportValidity();
    }

    function clearFieldErrors() {
        [
            nameInput,
            emailInput,
            phoneInput,
            subjectInput,
            messageInput
        ].forEach(function (input) {
            if (input) {
                input.setCustomValidity("");
            }
        });

        if (serviceError) {
            serviceError.textContent = "";
        }

        if (trigger) {
            trigger.removeAttribute("aria-invalid");
        }
    }

    function showStatus(message, type) {
        if (!statusMessage) return;

        clearTimeout(statusTimer);

        statusMessage.textContent = message;
        statusMessage.hidden = false;
        statusMessage.dataset.state = type;

        statusMessage.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }

    function hideStatus() {
        if (!statusMessage) return;

        statusMessage.hidden = true;
        statusMessage.textContent = "";
        delete statusMessage.dataset.state;
    }

    function resetServiceDropdown() {
        if (!dropdown || !serviceInput) return;

        serviceInput.value = "";

        if (valueText) {
            valueText.textContent = "Select a service";
        }

        if (optionsList) {
            optionsList.querySelectorAll('[role="option"]').forEach(
                function (option) {
                    option.classList.remove("is-selected", "is-active");
                    option.setAttribute("aria-selected", "false");
                }
            );

            optionsList.hidden = true;
        }

        dropdown.classList.remove("is-open");

        if (trigger) {
            trigger.setAttribute("aria-expanded", "false");
            trigger.removeAttribute("aria-invalid");
        }

        if (serviceError) {
            serviceError.textContent = "";
        }
    }

    /* ==========================================
       CLEAR ERRORS WHILE TYPING
    ========================================== */

    [nameInput, emailInput, phoneInput, subjectInput, messageInput]
        .forEach(function (input) {

            if (!input) return;

            input.addEventListener("input", function () {
                input.setCustomValidity("");
            });
        });

    if (consentInput) {
        consentInput.addEventListener("change", function () {
            consentInput.setCustomValidity("");
        });
    }

    /* ==========================================
       FORM SUBMISSION & VALIDATION
    ========================================== */

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        if (isSubmitting) return;

        clearTimeout(statusTimer);
        hideStatus();
        clearFieldErrors();

        /* NAME: letters and spaces only */

        const name = nameInput.value.trim();
        const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;

        if (!name) {
            showFieldError(nameInput, "Please enter your full name.");
            return;
        }

        if (!namePattern.test(name)) {
            showFieldError(
                nameInput,
                "Name must contain letters only. Spaces, apostrophes and hyphens are allowed."
            );
            return;
        }

        /* EMAIL: valid email format */

        const email = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!email) {
            showFieldError(emailInput, "Please enter your email address.");
            return;
        }

        if (!emailPattern.test(email) || !emailInput.validity.valid) {
            showFieldError(
                emailInput,
                "Please enter a valid email address, such as name@example.com."
            );
            return;
        }

        /* PHONE: optional, but exactly 10 digits if entered */

        const phone = phoneInput.value.trim();

        if (phone && !/^[0-9]{10}$/.test(phone)) {
            showFieldError(
                phoneInput,
                "Please enter a valid 10-digit phone number without spaces or country code."
            );
            return;
        }

        /* SERVICE: custom dropdown */

        if (!serviceInput.value) {
            serviceError.textContent = "Please select a service.";
            trigger.setAttribute("aria-invalid", "true");
            trigger.focus();
            return;
        }

        /* SUBJECT: required, minimum 3 characters */

        const subject = subjectInput.value.trim();

        if (!subject) {
            showFieldError(subjectInput, "Please enter the subject.");
            return;
        }

        if (subject.length < 3) {
            showFieldError(
                subjectInput,
                "Subject must contain at least 3 characters."
            );
            return;
        }

        /* MESSAGE: required */

        const message = messageInput.value.trim();

        if (!message) {
            showFieldError(messageInput, "Please enter your message.");
            return;
        }

        if (message.length < 10) {
            showFieldError(
                messageInput,
                "Please provide at least 10 characters in your message."
            );
            return;
        }

        /* CONSENT: required */

        if (!consentInput.checked) {
            showFieldError(
                consentInput,
                "Please agree to be contacted regarding your enquiry."
            );
            return;
        }

        /* ==========================================
           SUCCESS
        ========================================== */

        isSubmitting = true;

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.style.opacity = "0.7";
            submitButton.style.cursor = "wait";
        }

        showStatus(
            "Thank you! Your enquiry has been submitted successfully.",
            "success"
        );

        /* Clear the form */

        form.reset();
        resetServiceDropdown();

        /* Remove success message after 4 seconds */

        statusTimer = setTimeout(function () {
            hideStatus();
        }, 4000);

        /* Re-enable the submit button */

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.style.opacity = "";
            submitButton.style.cursor = "";
        }

        isSubmitting = false;
    });

});



/* ==========================================
   STACKLY LEGAL
   CONTACT FAQ ACCORDION
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const faqSection = document.querySelector("#nplContactFAQ");

    if (!faqSection) return;

    const faqItems = faqSection.querySelectorAll(
        ".npl-contact-faq-item"
    );

    faqItems.forEach(function (item) {

        const question = item.querySelector(
            ".npl-contact-faq-question"
        );

        const answer = item.querySelector(
            ".npl-contact-faq-answer"
        );

        if (!question || !answer) return;

        // Synchronize initial HTML state.
        const initiallyExpanded =
            question.getAttribute("aria-expanded") === "true";

        answer.hidden = !initiallyExpanded;
        item.classList.toggle("active", initiallyExpanded);

        question.addEventListener("click", function () {

            const isExpanded =
                question.getAttribute("aria-expanded") === "true";

            // Close all other FAQ items.
            faqItems.forEach(function (otherItem) {

                const otherQuestion = otherItem.querySelector(
                    ".npl-contact-faq-question"
                );

                const otherAnswer = otherItem.querySelector(
                    ".npl-contact-faq-answer"
                );

                if (!otherQuestion || !otherAnswer) return;

                otherQuestion.setAttribute("aria-expanded", "false");
                otherAnswer.hidden = true;
                otherItem.classList.remove("active");

            });

            // Open the clicked item if it was previously closed.
            if (!isExpanded) {

                question.setAttribute("aria-expanded", "true");
                answer.hidden = false;
                item.classList.add("active");

            }

        });

    });

});



/* ==========================================
   STACKLY LEGAL — PAGE LOADER
========================================== */

(function () {
    const loader = document.getElementById("nplPageLoader");

    if (!loader) return;

    const loaderStartTime = Date.now();
    const minimumDisplayTime = 1500;
    let loaderHidden = false;

    function hideNplLoader() {
        if (loaderHidden) return;

        loaderHidden = true;

        const elapsed = Date.now() - loaderStartTime;
        const remainingTime = Math.max(
            0,
            minimumDisplayTime - elapsed
        );

        setTimeout(function () {
            loader.classList.add("is-hidden");
            loader.setAttribute("aria-hidden", "true");
            loader.removeAttribute("role");

            setTimeout(function () {
                loader.remove();
            }, 2000);
        }, remainingTime);
    }

    if (document.readyState === "complete") {
        hideNplLoader();
    } else {
        window.addEventListener("load", hideNplLoader, {
            once: true
        });
    }
})();


document.addEventListener("DOMContentLoaded", function () {
        if (typeof AOS !== "undefined") {
            AOS.init({
                duration: 900,
                once: true,
                offset: 70,
                easing: "ease-out-cubic",
                mirror: false,
                disable: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches
            });
        }
    });