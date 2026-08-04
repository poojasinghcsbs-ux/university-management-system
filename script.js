const API_BASE_URL = "http://localhost:8080/api";

// =====================================================
//                    PAGE LOADER
// =====================================================

const pageLoader = document.getElementById("pageLoader");

window.addEventListener("load", () => {
    setTimeout(() => {
        if (pageLoader) {
            pageLoader.classList.add("hide-loader");
        }
    }, 700);
});


// =====================================================
//                 CURRENT YEAR IN FOOTER
// =====================================================

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


// =====================================================
//                    NAVBAR SCROLL
// =====================================================

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {

    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add("navbar-scrolled");
    } else {
        navbar.classList.remove("navbar-scrolled");
    }
});


// =====================================================
//                  SCROLL PROGRESS BAR
// =====================================================

const scrollProgress = document.getElementById("scrollProgress");

window.addEventListener("scroll", () => {

    if (!scrollProgress) return;

    const scrollTop =
        document.documentElement.scrollTop ||
        document.body.scrollTop;

    const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const progress =
        scrollHeight > 0
            ? (scrollTop / scrollHeight) * 100
            : 0;

    scrollProgress.style.width = progress + "%";
});


// =====================================================
//                  MOBILE NAVIGATION
// =====================================================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("mobile-menu-active");

        if (navLinks.classList.contains("mobile-menu-active")) {
            menuToggle.textContent = "✕";
        } else {
            menuToggle.textContent = "☰";
        }
    });


    document.querySelectorAll(".nav-link").forEach((link) => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("mobile-menu-active");

            menuToggle.textContent = "☰";
        });
    });
}


// =====================================================
//                    SMOOTH SCROLL
// =====================================================

document.querySelectorAll('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", function (event) {

        const targetId = this.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});


// =====================================================
//                 ACTIVE NAVBAR LINK
// =====================================================

const sections = document.querySelectorAll("section[id]");
const navigationLinks = document.querySelectorAll(".nav-link");

function updateActiveNavigation() {

    let currentSection = "";

    sections.forEach((section) => {

        const sectionTop = section.offsetTop;

        if (window.scrollY >= sectionTop - 180) {
            currentSection = section.getAttribute("id");
        }
    });


    navigationLinks.forEach((link) => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + currentSection) {
            link.classList.add("active");
        }
    });
}

window.addEventListener("scroll", updateActiveNavigation);


// =====================================================
//                   REVEAL ON SCROLL
// =====================================================

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("reveal-active");

                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});


// =====================================================
//                  ANIMATED COUNTERS
// =====================================================

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            const counter = entry.target;

            const target = Number(counter.dataset.target);
            const suffix = counter.dataset.suffix || "";

            const duration = 1300;
            const startTime = performance.now();


            function updateCounter(currentTime) {

                const elapsed = currentTime - startTime;

                const progress = Math.min(
                    elapsed / duration,
                    1
                );

                const value = Math.floor(
                    progress * target
                );

                counter.textContent = value + suffix;


                if (progress < 1) {

                    requestAnimationFrame(updateCounter);

                } else {

                    counter.textContent = target + suffix;
                }
            }


            requestAnimationFrame(updateCounter);

            observer.unobserve(counter);
        });
    },
    {
        threshold: 0.5
    }
);

counters.forEach((counter) => {
    counterObserver.observe(counter);
});


// =====================================================
//                    BACK TO TOP
// =====================================================

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {

    if (!backToTop) return;

    if (window.scrollY > 500) {

        backToTop.classList.add("show-back-to-top");

    } else {

        backToTop.classList.remove("show-back-to-top");
    }
});


if (backToTop) {

    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


// =====================================================
//                    GALLERY LIGHTBOX
// =====================================================

const galleryItems = document.querySelectorAll(".gallery-item");

const lightbox = document.getElementById("lightbox");

const lightboxImage = document.getElementById("lightboxImage");

const lightboxCaption = document.getElementById("lightboxCaption");

const lightboxClose = document.getElementById("lightboxClose");


galleryItems.forEach((item) => {

    item.addEventListener("click", () => {

        const image = item.querySelector("img");

        const caption = item.querySelector(".gallery-caption");


        if (!image || !lightbox || !lightboxImage) {
            return;
        }


        lightboxImage.src = image.src;

        lightboxImage.alt =
            image.alt || "Campus Preview";


        if (lightboxCaption) {

            lightboxCaption.textContent =
                caption
                    ? caption.textContent
                    : image.alt;
        }


        lightbox.classList.add("lightbox-active");

        document.body.classList.add("no-scroll");
    });
});


function closeLightbox() {

    if (!lightbox) return;

    lightbox.classList.remove("lightbox-active");

    document.body.classList.remove("no-scroll");
}


if (lightboxClose) {

    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );
}


if (lightbox) {

    lightbox.addEventListener("click", (event) => {

        if (event.target === lightbox) {
            closeLightbox();
        }
    });
}


document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        lightbox &&
        lightbox.classList.contains("lightbox-active")
    ) {

        closeLightbox();
    }
});


// =====================================================
//             SAVE PUBLIC FORM DATA THROUGH API
// =====================================================

async function saveEnquiry(enquiry) {

    const response = await fetch(`${API_BASE_URL}/enquiries`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(enquiry)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Unable to submit your enquiry.");
    }

    return data;
}

async function subscribeToNewsletter(email) {

    const response = await fetch(`${API_BASE_URL}/newsletter`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Unable to subscribe right now.");
    }

    return data;
}


// =====================================================
//                  LATEST NOTICES API
// =====================================================

function escapeNoticeHTML(value) {
    const element = document.createElement("div");
    element.textContent = String(value ?? "");
    return element.innerHTML;
}

function formatPublicNoticeDate(value) {
    if (!value) {
        return "";
    }
    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeZone: "UTC"
    }).format(new Date(`${value}T00:00:00Z`));
}

function getNoticeIcon(category) {
    const icons = {
        ADMISSIONS: "&#127891;",
        ACADEMIC: "&#128218;",
        EXAMINATION: "&#128197;",
        PLACEMENT: "&#128188;",
        EVENTS: "&#127917;",
        GENERAL: "&#128226;"
    };
    return icons[category] || icons.GENERAL;
}

async function loadPublicNotices() {
    const noticeContainer = document.getElementById("noticeContainer");
    if (!noticeContainer) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/notices`);
        const notices = await response.json().catch(() => []);

        if (!response.ok || !Array.isArray(notices) || notices.length === 0) {
            return;
        }

        noticeContainer.innerHTML = notices.slice(0, 6).map((notice) => `
            <article class="notice-card">
                <div class="notice-icon">${getNoticeIcon(notice.category)}</div>
                <div class="notice-content">
                    <span>${escapeNoticeHTML(notice.category)}</span>
                    <h3>${escapeNoticeHTML(notice.title)}</h3>
                    <p>${escapeNoticeHTML(notice.description)}</p>
                    <small>Published: ${escapeNoticeHTML(formatPublicNoticeDate(notice.noticeDate))}</small>
                </div>
            </article>`).join("");
    } catch (error) {
        // The existing static notices remain visible if the API is unavailable.
    }
}

loadPublicNotices();


// =====================================================
//                  PROGRAMMES API
// =====================================================

function getCourseIcon(courseType) {
    const icons = {
        ENGINEERING: "&#128187;",
        COMPUTER: "&#128421;",
        MANAGEMENT: "&#128200;",
        SCIENCE: "&#128300;",
        COMMERCE: "&#128202;",
        GENERAL: "&#127891;"
    };
    return icons[courseType] || icons.GENERAL;
}

function formatPublicCourseType(courseType) {
    const types = {
        ENGINEERING: "Engineering",
        COMPUTER: "Computer Applications",
        MANAGEMENT: "Management",
        SCIENCE: "Science",
        COMMERCE: "Commerce",
        GENERAL: "General"
    };
    return types[courseType] || courseType || "Programme";
}

async function loadPublicCourses() {
    const courseContainer = document.getElementById("courseContainer");
    if (!courseContainer) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/courses`);
        const courses = await response.json().catch(() => []);

        if (!response.ok || !Array.isArray(courses) || courses.length === 0) {
            return;
        }

        courseContainer.innerHTML = courses.map((course) => `
            <article class="course-card">
                <div class="course-icon">${getCourseIcon(course.courseType)}</div>
                <h3>${escapeNoticeHTML(course.name)}</h3>
                <p>${escapeNoticeHTML(course.description)}</p>
                <small class="course-meta">${escapeNoticeHTML(course.department)} · ${escapeNoticeHTML(course.duration)} · ${escapeNoticeHTML(formatPublicCourseType(course.courseType))}</small>
                <a href="#contact">Explore Course &rarr;</a>
            </article>`).join("");
    } catch (error) {
        // The existing static course cards remain visible if the API is unavailable.
    }
}

loadPublicCourses();


// =====================================================
//                  DEPARTMENTS API
// =====================================================

async function loadPublicDepartments() {
    const departmentContainer = document.getElementById("departmentContainer");
    if (!departmentContainer) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/departments`);
        const departments = await response.json().catch(() => []);

        if (!response.ok || !Array.isArray(departments) || departments.length === 0) {
            return;
        }

        departmentContainer.innerHTML = departments.map((department) => `
            <article class="department-card">
                <span>${escapeNoticeHTML(department.departmentCode)}</span>
                <h3>${escapeNoticeHTML(department.name)}</h3>
                <p>${escapeNoticeHTML(department.description)}</p>
                <small class="department-hod">Head: ${escapeNoticeHTML(department.hodName)}</small>
            </article>`).join("");
    } catch (error) {
        // The existing static department cards remain visible if the API is unavailable.
    }
}

loadPublicDepartments();


// =====================================================
//                 PLACEMENT DRIVES API
// =====================================================

function formatPublicPlacementDate(value) {
    if (!value) {
        return "";
    }
    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeZone: "UTC"
    }).format(new Date(`${value}T00:00:00Z`));
}

async function loadPublicPlacementDrives() {
    const placementDriveWrapper = document.getElementById("placementDriveWrapper");
    const placementDriveContainer = document.getElementById("placementDriveContainer");
    if (!placementDriveWrapper || !placementDriveContainer) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/placements`);
        const drives = await response.json().catch(() => []);

        if (!response.ok || !Array.isArray(drives) || drives.length === 0) {
            return;
        }

        placementDriveContainer.innerHTML = drives.slice(0, 6).map((drive) => `
            <article class="placement-drive-card">
                <h3>${escapeNoticeHTML(drive.companyName)}</h3>
                <p class="placement-drive-role">${escapeNoticeHTML(drive.jobRole)}</p>
                <p>${escapeNoticeHTML(drive.description)}</p>
                <div class="placement-drive-meta">
                    <span><strong>Package:</strong> ${escapeNoticeHTML(drive.packageOffered)}</span>
                    <span><strong>Eligibility:</strong> ${escapeNoticeHTML(drive.eligibility)}</span>
                    <span><strong>Drive Date:</strong> ${escapeNoticeHTML(formatPublicPlacementDate(drive.driveDate))}</span>
                </div>
            </article>`).join("");
        placementDriveWrapper.hidden = false;
    } catch (error) {
        // The placement highlights remain visible if the API is unavailable.
    }
}

loadPublicPlacementDrives();


// =====================================================
//                 CONTACT FORM VALIDATION
// =====================================================

const contactForm = document.getElementById("contactForm");

const formSuccess = document.getElementById("formSuccess");


if (contactForm) {

    contactForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const fullName = document.getElementById("fullName");

        const email = document.getElementById("email");

        const mobile = document.getElementById("mobile");

        const enquiryType = document.getElementById("enquiryType");

        const message = document.getElementById("message");


        let isValid = true;


        clearErrors();


        // -----------------------------
        // NAME VALIDATION
        // -----------------------------

        if (fullName.value.trim().length < 3) {

            showError(
                fullName,
                "Please enter your full name."
            );

            isValid = false;
        }


        // -----------------------------
        // EMAIL VALIDATION
        // -----------------------------

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email.value.trim())) {

            showError(
                email,
                "Please enter a valid email address."
            );

            isValid = false;
        }


        // -----------------------------
        // MOBILE VALIDATION
        // -----------------------------

        const mobilePattern = /^[6-9]\d{9}$/;


        if (!mobilePattern.test(mobile.value.trim())) {

            showError(
                mobile,
                "Please enter a valid 10-digit mobile number."
            );

            isValid = false;
        }


        // -----------------------------
        // ENQUIRY TYPE VALIDATION
        // -----------------------------

        if (enquiryType.value === "") {

            showError(
                enquiryType,
                "Please select an enquiry type."
            );

            isValid = false;
        }


        // -----------------------------
        // MESSAGE VALIDATION
        // -----------------------------

        if (message.value.trim().length < 10) {

            showError(
                message,
                "Please write at least 10 characters."
            );

            isValid = false;
        }


        // =====================================================
        //            SAVE FORM IF EVERYTHING IS VALID
        // =====================================================

        if (!isValid) {
            return;
        }

        const submitButton =
            contactForm.querySelector('button[type="submit"]');

        const defaultButtonText = submitButton?.textContent;

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Submitting...";
        }

        try {
            await saveEnquiry({
                fullName: fullName.value.trim(),
                email: email.value.trim(),
                mobile: mobile.value.trim(),
                enquiryType: enquiryType.value,
                message: message.value.trim()
            });

            if (formSuccess) {
                formSuccess.textContent =
                    "✓ Thank you! Your enquiry has been submitted successfully.";
                formSuccess.classList.add("show-success");
            }

            contactForm.reset();

            setTimeout(() => {
                formSuccess?.classList.remove("show-success");
            }, 5000);
        } catch (error) {
            alert(error.message || "Unable to submit your enquiry. Please try again.");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = defaultButtonText;
            }
        }
    });
}


// =====================================================
//                 FORM ERROR FUNCTIONS
// =====================================================

function showError(input, message) {

    input.classList.add("input-error");

    const group = input.closest(".input-group");

    if (!group) return;

    const errorMessage =
        group.querySelector(".error-message");

    if (errorMessage) {
        errorMessage.textContent = message;
    }
}


function clearErrors() {

    document
        .querySelectorAll(".input-error")
        .forEach((input) => {

            input.classList.remove("input-error");
        });


    document
        .querySelectorAll(".error-message")
        .forEach((message) => {

            message.textContent = "";
        });


    if (formSuccess) {

        formSuccess.classList.remove(
            "show-success"
        );
    }
}


// =====================================================
//        REMOVE ERROR WHILE USER IS TYPING
// =====================================================

document
    .querySelectorAll(
        "#contactForm input, #contactForm textarea, #contactForm select"
    )
    .forEach((input) => {

        const eventName =
            input.tagName === "SELECT"
                ? "change"
                : "input";


        input.addEventListener(eventName, () => {

            input.classList.remove("input-error");


            const group =
                input.closest(".input-group");


            if (group) {

                const error =
                    group.querySelector(".error-message");


                if (error) {
                    error.textContent = "";
                }
            }
        });
    });


// =====================================================
//                 NEWSLETTER FORM
// =====================================================

const newsletterForm =
    document.getElementById("newsletterForm");

const newsletterEmail =
    document.getElementById("newsletterEmail");

const newsletterMessage =
    document.getElementById("newsletterMessage");


if (
    newsletterForm &&
    newsletterEmail &&
    newsletterMessage
) {

    newsletterForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const email =
            newsletterEmail.value.trim();


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

            newsletterMessage.textContent =
                "Please enter a valid email address.";

            return;
        }


        const submitButton =
            newsletterForm.querySelector('button[type="submit"]');

        const defaultButtonText = submitButton?.textContent;

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Subscribing...";
        }

        try {
            await subscribeToNewsletter(email);
            newsletterMessage.textContent =
                "✓ You're subscribed! Thank you for staying connected with RGPV.";
            newsletterEmail.value = "";
        } catch (error) {
            newsletterMessage.textContent =
                error.message || "Unable to subscribe right now. Please try again.";
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = defaultButtonText;
            }
        }

        setTimeout(() => {
            newsletterMessage.textContent = "";
        }, 5000);
    });
}


// =====================================================
//             COURSE CARD INTERACTION
// =====================================================

const courseCards = document.querySelectorAll(".course-card");


courseCards.forEach((card) => {

    card.addEventListener("mouseenter", () => {

        const icon =
            card.querySelector(".course-icon");


        if (icon) {

            icon.style.transform =
                "rotate(-5deg) scale(1.08)";

            icon.style.transition = "0.3s";
        }
    });


    card.addEventListener("mouseleave", () => {

        const icon =
            card.querySelector(".course-icon");


        if (icon) {

            icon.style.transform =
                "rotate(0deg) scale(1)";
        }
    });
});
