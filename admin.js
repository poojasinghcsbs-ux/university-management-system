// =====================================================
//                GET SAVED DATA
// =====================================================

function getEnquiries() {
    try {
        return JSON.parse(
            localStorage.getItem("rgpvEnquiries")
        ) || [];
    } catch (error) {
        return [];
    }
}

function getSubscribers() {
    try {
        return JSON.parse(
            localStorage.getItem("rgpvSubscribers")
        ) || [];
    } catch (error) {
        return [];
    }
}


// =====================================================
//                HTML SAFETY FUNCTION
// =====================================================

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = String(value ?? "");

    return div.innerHTML;
}


// =====================================================
//                FORMAT ENQUIRY TYPE
// =====================================================

function formatEnquiryType(type) {

    const types = {
        admission: "Admission",
        course: "Course Information",
        examination: "Examination",
        placement: "Placement",
        other: "Other"
    };

    return types[type] || type;
}


// =====================================================
//                DASHBOARD COUNTERS
// =====================================================

function updateDashboard() {

    const enquiries = getEnquiries();
    const subscribers = getSubscribers();

    const totalEnquiries =
        document.getElementById("totalEnquiries");

    const totalSubscribers =
        document.getElementById("totalSubscribers");

    const todayEnquiries =
        document.getElementById("todayEnquiries");


    if (totalEnquiries) {
        totalEnquiries.textContent = enquiries.length;
    }


    if (totalSubscribers) {
        totalSubscribers.textContent = subscribers.length;
    }


    const today =
        new Date().toLocaleDateString("en-IN");


    const todayCount =
        enquiries.filter(
            enquiry => enquiry.date === today
        ).length;


    if (todayEnquiries) {
        todayEnquiries.textContent = todayCount;
    }
}


// =====================================================
//                DISPLAY ENQUIRIES
// =====================================================

function displayEnquiries(searchText = "") {

    const enquiries = getEnquiries();

    const tableBody =
        document.getElementById("enquiryTableBody");

    const noEnquiries =
        document.getElementById("noEnquiries");


    if (!tableBody || !noEnquiries) return;


    tableBody.innerHTML = "";


    const search =
        searchText.trim().toLowerCase();


    const filteredEnquiries =
        enquiries.filter((enquiry) => {

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


    // Latest enquiry first

    const reversedEnquiries =
        [...filteredEnquiries].reverse();


    reversedEnquiries.forEach((enquiry) => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(enquiry.name)}
                </strong>
            </td>


            <td>
                ${escapeHTML(enquiry.email)}
            </td>


            <td>
                ${escapeHTML(enquiry.mobile)}
            </td>


            <td>

                <span class="enquiry-badge">

                    ${escapeHTML(
                        formatEnquiryType(
                            enquiry.enquiryType
                        )
                    )}

                </span>

            </td>


            <td class="message-cell">

                ${escapeHTML(enquiry.message)}

            </td>


            <td>

                ${escapeHTML(enquiry.date)}

                <br>

                <small>
                    ${escapeHTML(enquiry.time)}
                </small>

            </td>


            <td>

                <button
                    class="view-btn"
                    data-id="${enquiry.id}">
                    View Details
                </button>

                <button
                    class="delete-btn"
                    data-id="${enquiry.id}">
                    Delete
                </button>

            </td>
        `;


        tableBody.appendChild(row);
    });


    // =====================================================
    //              VIEW DETAILS BUTTON
    // =====================================================

    document
        .querySelectorAll(
            "#enquiryTableBody .view-btn"
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    openEnquiryModal(id);
                }
            );
        });


    // =====================================================
    //                 DELETE BUTTON
    // =====================================================

    document
        .querySelectorAll(
            "#enquiryTableBody .delete-btn"
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    deleteEnquiry(id);
                }
            );
        });
}


// =====================================================
//                DELETE ONE ENQUIRY
// =====================================================

function deleteEnquiry(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this enquiry?"
        );


    if (!confirmation) return;


    let enquiries = getEnquiries();


    enquiries =
        enquiries.filter(
            enquiry => enquiry.id !== id
        );


    localStorage.setItem(
        "rgpvEnquiries",
        JSON.stringify(enquiries)
    );


    displayEnquiries();

    updateDashboard();
}


// =====================================================
//                CLEAR ALL ENQUIRIES
// =====================================================

const clearEnquiriesButton =
    document.getElementById("clearEnquiries");


if (clearEnquiriesButton) {

    clearEnquiriesButton.addEventListener(
        "click",
        () => {

            const enquiries = getEnquiries();


            if (enquiries.length === 0) {

                alert(
                    "There are no enquiries to clear."
                );

                return;
            }


            const confirmation =
                confirm(
                    "Delete all enquiries? This cannot be undone."
                );


            if (!confirmation) return;


            localStorage.removeItem(
                "rgpvEnquiries"
            );


            displayEnquiries();

            updateDashboard();
        }
    );
}


// =====================================================
//                SEARCH ENQUIRIES
// =====================================================

const searchEnquiry =
    document.getElementById("searchEnquiry");


if (searchEnquiry) {

    searchEnquiry.addEventListener(
        "input",
        () => {

            displayEnquiries(
                searchEnquiry.value
            );
        }
    );
}


// =====================================================
//                DISPLAY SUBSCRIBERS
// =====================================================

function displaySubscribers() {

    const subscribers = getSubscribers();

    const tableBody =
        document.getElementById(
            "subscriberTableBody"
        );

    const noSubscribers =
        document.getElementById(
            "noSubscribers"
        );


    if (!tableBody || !noSubscribers) return;


    tableBody.innerHTML = "";


    if (subscribers.length === 0) {

        noSubscribers.classList.add(
            "show-empty"
        );

        return;
    }


    noSubscribers.classList.remove(
        "show-empty"
    );


    const reversedSubscribers =
        [...subscribers].reverse();


    reversedSubscribers.forEach(
        (subscriber, index) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td>
                    <strong>
                        ${escapeHTML(
                            subscriber.email
                        )}
                    </strong>
                </td>


                <td>
                    ${escapeHTML(
                        subscriber.date
                    )}
                </td>


                <td>

                    <button
                        class="delete-btn subscriber-delete"
                        data-id="${subscriber.id}">

                        Delete

                    </button>

                </td>
            `;


            tableBody.appendChild(row);
        }
    );


    document
        .querySelectorAll(
            ".subscriber-delete"
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    deleteSubscriber(id);
                }
            );
        });
}


// =====================================================
//                DELETE SUBSCRIBER
// =====================================================

function deleteSubscriber(id) {

    const confirmation =
        confirm(
            "Delete this subscriber?"
        );


    if (!confirmation) return;


    let subscribers =
        getSubscribers();


    subscribers =
        subscribers.filter(
            subscriber =>
                subscriber.id !== id
        );


    localStorage.setItem(
        "rgpvSubscribers",
        JSON.stringify(subscribers)
    );


    displaySubscribers();

    updateDashboard();
}


// =====================================================
//              CLEAR ALL SUBSCRIBERS
// =====================================================

const clearSubscribersButton =
    document.getElementById(
        "clearSubscribers"
    );


if (clearSubscribersButton) {

    clearSubscribersButton.addEventListener(
        "click",
        () => {

            const subscribers =
                getSubscribers();


            if (subscribers.length === 0) {

                alert(
                    "There are no subscribers to clear."
                );

                return;
            }


            const confirmation =
                confirm(
                    "Delete all newsletter subscribers?"
                );


            if (!confirmation) return;


            localStorage.removeItem(
                "rgpvSubscribers"
            );


            displaySubscribers();

            updateDashboard();
        }
    );
}


// =====================================================
//              ENQUIRY DETAILS POPUP
// =====================================================

const enquiryModal =
    document.getElementById("enquiryModal");

const modalClose =
    document.getElementById("modalClose");


// =====================================================
//                   OPEN POPUP
// =====================================================

function openEnquiryModal(id) {

    const enquiries = getEnquiries();


    const enquiry =
        enquiries.find(
            item => item.id === id
        );


    if (!enquiry || !enquiryModal) return;


    const modalName =
        document.getElementById("modalName");

    const modalEmail =
        document.getElementById("modalEmail");

    const modalMobile =
        document.getElementById("modalMobile");

    const modalType =
        document.getElementById("modalType");

    const modalDate =
        document.getElementById("modalDate");

    const modalMessage =
        document.getElementById("modalMessage");


    if (modalName) {
        modalName.textContent =
            enquiry.name || "-";
    }


    if (modalEmail) {
        modalEmail.textContent =
            enquiry.email || "-";
    }


    if (modalMobile) {
        modalMobile.textContent =
            enquiry.mobile || "-";
    }


    if (modalType) {
        modalType.textContent =
            formatEnquiryType(
                enquiry.enquiryType
            ) || "-";
    }


    if (modalDate) {

        modalDate.textContent =
            (enquiry.date || "-") +
            "  •  " +
            (enquiry.time || "-");
    }


    if (modalMessage) {
        modalMessage.textContent =
            enquiry.message || "-";
    }


    enquiryModal.classList.add(
        "show-modal"
    );


    document.body.style.overflow =
        "hidden";
}


// =====================================================
//                   CLOSE POPUP
// =====================================================

function closeEnquiryModal() {

    if (!enquiryModal) return;


    enquiryModal.classList.remove(
        "show-modal"
    );


    document.body.style.overflow = "";
}


// =====================================================
//                 X CLOSE BUTTON
// =====================================================

if (modalClose) {

    modalClose.addEventListener(
        "click",
        () => {

            closeEnquiryModal();
        }
    );
}


// =====================================================
//          CLICK OUTSIDE TO CLOSE POPUP
// =====================================================

if (enquiryModal) {

    enquiryModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === enquiryModal
            ) {

                closeEnquiryModal();
            }
        }
    );
}


// =====================================================
//              ESC KEY CLOSE POPUP
// =====================================================

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Escape") {

            closeEnquiryModal();
        }
    }
);


// =====================================================
//                  LOAD DASHBOARD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateDashboard();

        displayEnquiries();

        displaySubscribers();
    }
);