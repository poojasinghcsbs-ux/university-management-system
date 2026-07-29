const adminLoggedIn = sessionStorage.getItem("rgpvAdminLoggedIn");

if (adminLoggedIn !== "true") {
    window.location.replace("login.html");
}


function getEnquiries() {
    try {
        return JSON.parse(localStorage.getItem("rgpvEnquiries")) || [];
    } catch (error) {
        return [];
    }
}


function getSubscribers() {
    try {
        return JSON.parse(localStorage.getItem("rgpvSubscribers")) || [];
    } catch (error) {
        return [];
    }
}


function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = String(value ?? "");
    return div.innerHTML;
}


function formatEnquiryType(type) {
    const types = {
        admission: "Admission",
        course: "Course Information",
        examination: "Examination",
        placement: "Placement",
        other: "Other"
    };

    return types[type] || type || "-";
}


function updateDashboard() {
    const enquiries = getEnquiries();
    const subscribers = getSubscribers();

    const totalEnquiries = document.getElementById("totalEnquiries");
    const totalSubscribers = document.getElementById("totalSubscribers");
    const todayEnquiries = document.getElementById("todayEnquiries");

    if (totalEnquiries) {
        totalEnquiries.textContent = enquiries.length;
    }

    if (totalSubscribers) {
        totalSubscribers.textContent = subscribers.length;
    }

    const today = new Date().toLocaleDateString("en-IN");

    const todayCount = enquiries.filter(function (enquiry) {
        return enquiry.date === today;
    }).length;

    if (todayEnquiries) {
        todayEnquiries.textContent = todayCount;
    }
}


function displayEnquiries(searchText = "") {
    const enquiries = getEnquiries();

    const tableBody = document.getElementById("enquiryTableBody");
    const noEnquiries = document.getElementById("noEnquiries");

    if (!tableBody || !noEnquiries) {
        return;
    }

    tableBody.innerHTML = "";

    const search = searchText.trim().toLowerCase();

    const filteredEnquiries = enquiries.filter(function (enquiry) {
        const searchableText = `
            ${enquiry.name || ""}
            ${enquiry.email || ""}
            ${enquiry.mobile || ""}
            ${enquiry.enquiryType || ""}
            ${enquiry.message || ""}
            ${enquiry.date || ""}
        `.toLowerCase();

        return searchableText.includes(search);
    });


    if (filteredEnquiries.length === 0) {
        noEnquiries.classList.add("show-empty");
        return;
    }

    noEnquiries.classList.remove("show-empty");

    const reversedEnquiries = [...filteredEnquiries].reverse();


    reversedEnquiries.forEach(function (enquiry) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <strong>${escapeHTML(enquiry.name)}</strong>
            </td>

            <td>
                ${escapeHTML(enquiry.email)}
            </td>

            <td>
                ${escapeHTML(enquiry.mobile)}
            </td>

            <td>
                <span class="enquiry-badge">
                    ${escapeHTML(formatEnquiryType(enquiry.enquiryType))}
                </span>
            </td>

            <td class="message-cell">
                ${escapeHTML(enquiry.message)}
            </td>

            <td>
                ${escapeHTML(enquiry.date)}
                <br>
                <small>${escapeHTML(enquiry.time)}</small>
            </td>

            <td>
                <button
                    type="button"
                    class="view-btn"
                    data-id="${enquiry.id}">
                    View Details
                </button>

                <button
                    type="button"
                    class="delete-btn"
                    data-id="${enquiry.id}">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });


    document
        .querySelectorAll("#enquiryTableBody .view-btn")
        .forEach(function (button) {

            button.addEventListener("click", function () {
                const id = Number(button.dataset.id);
                openEnquiryModal(id);
            });

        });


    document
        .querySelectorAll("#enquiryTableBody .delete-btn")
        .forEach(function (button) {

            button.addEventListener("click", function () {
                const id = Number(button.dataset.id);
                deleteEnquiry(id);
            });

        });
}


function deleteEnquiry(id) {
    const confirmation = confirm(
        "Are you sure you want to delete this enquiry?"
    );

    if (!confirmation) {
        return;
    }

    let enquiries = getEnquiries();

    enquiries = enquiries.filter(function (enquiry) {
        return enquiry.id !== id;
    });

    localStorage.setItem(
        "rgpvEnquiries",
        JSON.stringify(enquiries)
    );

    displayEnquiries();
    updateDashboard();
}


function displaySubscribers() {
    const subscribers = getSubscribers();

    const tableBody = document.getElementById("subscriberTableBody");
    const noSubscribers = document.getElementById("noSubscribers");

    if (!tableBody || !noSubscribers) {
        return;
    }

    tableBody.innerHTML = "";


    if (subscribers.length === 0) {
        noSubscribers.classList.add("show-empty");
        return;
    }

    noSubscribers.classList.remove("show-empty");

    const reversedSubscribers = [...subscribers].reverse();


    reversedSubscribers.forEach(function (subscriber, index) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                ${index + 1}
            </td>

            <td>
                <strong>
                    ${escapeHTML(subscriber.email)}
                </strong>
            </td>

            <td>
                ${escapeHTML(subscriber.date)}
            </td>

            <td>
                <button
                    type="button"
                    class="delete-btn subscriber-delete"
                    data-id="${subscriber.id}">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });


    document
        .querySelectorAll(".subscriber-delete")
        .forEach(function (button) {

            button.addEventListener("click", function () {
                const id = Number(button.dataset.id);
                deleteSubscriber(id);
            });

        });
}


function deleteSubscriber(id) {
    const confirmation = confirm(
        "Delete this subscriber?"
    );

    if (!confirmation) {
        return;
    }

    let subscribers = getSubscribers();

    subscribers = subscribers.filter(function (subscriber) {
        return subscriber.id !== id;
    });

    localStorage.setItem(
        "rgpvSubscribers",
        JSON.stringify(subscribers)
    );

    displaySubscribers();
    updateDashboard();
}


function openEnquiryModal(id) {
    const enquiries = getEnquiries();

    const enquiry = enquiries.find(function (item) {
        return item.id === id;
    });

    const enquiryModal = document.getElementById("enquiryModal");

    if (!enquiry || !enquiryModal) {
        return;
    }

    document.getElementById("modalName").textContent =
        enquiry.name || "-";

    document.getElementById("modalEmail").textContent =
        enquiry.email || "-";

    document.getElementById("modalMobile").textContent =
        enquiry.mobile || "-";

    document.getElementById("modalType").textContent =
        formatEnquiryType(enquiry.enquiryType);

    document.getElementById("modalDate").textContent =
        (enquiry.date || "-") +
        " • " +
        (enquiry.time || "-");

    document.getElementById("modalMessage").textContent =
        enquiry.message || "-";

    enquiryModal.classList.add("show-modal");

    document.body.style.overflow = "hidden";
}


function closeEnquiryModal() {
    const enquiryModal = document.getElementById("enquiryModal");

    if (!enquiryModal) {
        return;
    }

    enquiryModal.classList.remove("show-modal");

    document.body.style.overflow = "";
}


document.addEventListener("DOMContentLoaded", function () {

    updateDashboard();
    displayEnquiries();
    displaySubscribers();


    const searchEnquiry =
        document.getElementById("searchEnquiry");

    const clearEnquiries =
        document.getElementById("clearEnquiries");

    const clearSubscribers =
        document.getElementById("clearSubscribers");

    const modalClose =
        document.getElementById("modalClose");

    const enquiryModal =
        document.getElementById("enquiryModal");

    const logoutBtn =
        document.getElementById("logoutBtn");


    if (searchEnquiry) {
        searchEnquiry.addEventListener("input", function () {
            displayEnquiries(searchEnquiry.value);
        });
    }


    if (clearEnquiries) {
        clearEnquiries.addEventListener("click", function () {

            const enquiries = getEnquiries();

            if (enquiries.length === 0) {
                alert("There are no enquiries to clear.");
                return;
            }

            const confirmation = confirm(
                "Delete all enquiries? This cannot be undone."
            );

            if (confirmation) {
                localStorage.removeItem("rgpvEnquiries");

                displayEnquiries();
                updateDashboard();
            }

        });
    }


    if (clearSubscribers) {
        clearSubscribers.addEventListener("click", function () {

            const subscribers = getSubscribers();

            if (subscribers.length === 0) {
                alert("There are no subscribers to clear.");
                return;
            }

            const confirmation = confirm(
                "Delete all newsletter subscribers?"
            );

            if (confirmation) {
                localStorage.removeItem("rgpvSubscribers");

                displaySubscribers();
                updateDashboard();
            }

        });
    }


    if (modalClose) {
        modalClose.addEventListener("click", function () {
            closeEnquiryModal();
        });
    }


    if (enquiryModal) {
        enquiryModal.addEventListener("click", function (event) {

            if (event.target === enquiryModal) {
                closeEnquiryModal();
            }

        });
    }


    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {

            const confirmation = confirm(
                "Are you sure you want to logout?"
            );

            if (confirmation) {
                sessionStorage.removeItem("rgpvAdminLoggedIn");
                window.location.replace("login.html");
            }

        });
    }

});


document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        closeEnquiryModal();
    }

});