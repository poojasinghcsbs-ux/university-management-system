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
//             SAVE ENQUIRY TO LOCAL STORAGE
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


// =====================================================
//                 CONTACT FORM VALIDATION
// =====================================================

const contactForm = document.getElementById("contactForm");

const formSuccess = document.getElementById("formSuccess");


if (contactForm) {

    contactForm.addEventListener("submit", (event) => {

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

        if (isValid) {

            const enquiryData = {

                id: Date.now(),

                name: fullName.value.trim(),

                email: email.value.trim(),

                mobile: mobile.value.trim(),

                enquiryType: enquiryType.value,

                message: message.value.trim(),

                date: new Date().toLocaleDateString("en-IN"),

                time: new Date().toLocaleTimeString(
                    "en-IN",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                )
            };


            // SAVE TO BROWSER

            saveEnquiry(enquiryData);


            // SHOW SUCCESS MESSAGE

            if (formSuccess) {

                formSuccess.classList.add(
                    "show-success"
                );
            }


            // CLEAR FORM

            contactForm.reset();


            // HIDE SUCCESS MESSAGE AFTER 5 SECONDS

            setTimeout(() => {

                if (formSuccess) {

                    formSuccess.classList.remove(
                        "show-success"
                    );
                }

            }, 5000);
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

    newsletterForm.addEventListener("submit", (event) => {

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


        // Save newsletter subscriber

        let subscribers = [];

        try {

            subscribers =
                JSON.parse(
                    localStorage.getItem("rgpvSubscribers")
                ) || [];

        } catch (error) {

            subscribers = [];
        }


        // Prevent duplicate email

        const alreadySubscribed =
            subscribers.some(
                (subscriber) =>
                    subscriber.email.toLowerCase() ===
                    email.toLowerCase()
            );


        if (alreadySubscribed) {

            newsletterMessage.textContent =
                "You are already subscribed.";

            return;
        }


        subscribers.push({

            id: Date.now(),

            email: email,

            date: new Date().toLocaleDateString("en-IN")
        });


        localStorage.setItem(
            "rgpvSubscribers",
            JSON.stringify(subscribers)
        );


        newsletterMessage.textContent =
            "✓ You're subscribed! Thank you for staying connected with RGPV.";


        newsletterEmail.value = "";


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
