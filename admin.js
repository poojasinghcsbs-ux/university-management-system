const API_BASE_URL = "http://localhost:8080/api";
const adminToken = sessionStorage.getItem("rgpvAdminToken");

if (!adminToken) {
    window.location.replace("login.html");
}

let currentEnquiries = [];
let currentSubscribers = [];
let currentNotices = [];
let currentCourses = [];

function escapeHTML(value) {
    const element = document.createElement("div");
    element.textContent = String(value ?? "");
    return element.innerHTML;
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

function formatStatus(status) {
    const statuses = {
        NEW: "New",
        IN_PROGRESS: "In Progress",
        RESOLVED: "Resolved"
    };
    return statuses[status] || "New";
}

function formatDateTime(value) {
    if (!value) {
        return "-";
    }
    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date(value));
}

function formatNoticeDate(value) {
    if (!value) {
        return "-";
    }
    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeZone: "UTC"
    }).format(new Date(`${value}T00:00:00Z`));
}

function formatNoticeCategory(category) {
    return String(category || "GENERAL")
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatCourseType(courseType) {
    const types = {
        ENGINEERING: "Engineering",
        COMPUTER: "Computer Applications",
        MANAGEMENT: "Management",
        SCIENCE: "Science",
        COMMERCE: "Commerce",
        GENERAL: "General"
    };
    return types[courseType] || courseType || "-";
}

async function apiRequest(path, options = {}) {
    const headers = {
        Authorization: `Bearer ${adminToken}`,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {})
    };

    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    const hasJson = response.headers.get("content-type")?.includes("application/json");
    const data = hasJson ? await response.json() : null;

    if (response.status === 401) {
        sessionStorage.removeItem("rgpvAdminToken");
        sessionStorage.removeItem("rgpvAdminLoggedIn");
        window.location.replace("login.html");
        throw new Error("Your admin session has expired.");
    }

    if (!response.ok) {
        throw new Error(data?.message || "Unable to complete this request.");
    }
    return data;
}

async function refreshDashboard() {
    const dashboard = await apiRequest("/admin/dashboard");
    setText("totalEnquiries", dashboard.totalEnquiries);
    setText("totalSubscribers", dashboard.totalSubscribers);
    setText("todayEnquiries", dashboard.todayEnquiries);
}

async function loadEnquiries(search = "") {
    const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
    currentEnquiries = await apiRequest(`/admin/enquiries${query}`);
    displayEnquiries();
}

async function loadSubscribers() {
    currentSubscribers = await apiRequest("/admin/subscribers");
    displaySubscribers();
}

async function loadNotices() {
    currentNotices = await apiRequest("/admin/notices");
    displayNotices();
}

async function loadCourses() {
    currentCourses = await apiRequest("/admin/courses");
    displayCourses();
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function displayEnquiries() {
    const tableBody = document.getElementById("enquiryTableBody");
    const noEnquiries = document.getElementById("noEnquiries");
    if (!tableBody || !noEnquiries) {
        return;
    }

    tableBody.innerHTML = "";
    noEnquiries.classList.toggle("show-empty", currentEnquiries.length === 0);

    currentEnquiries.forEach((enquiry) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${escapeHTML(enquiry.fullName)}</strong></td>
            <td>${escapeHTML(enquiry.email)}</td>
            <td>${escapeHTML(enquiry.mobile)}</td>
            <td><span class="enquiry-badge">${escapeHTML(formatEnquiryType(enquiry.enquiryType))}</span></td>
            <td class="message-cell">${escapeHTML(enquiry.message)}</td>
            <td>${escapeHTML(formatDateTime(enquiry.createdAt))}</td>
            <td>
                <div class="status-control">
                    <select class="status-select" data-id="${enquiry.id}" aria-label="Enquiry status">
                        <option value="NEW" ${enquiry.status === "NEW" ? "selected" : ""}>New</option>
                        <option value="IN_PROGRESS" ${enquiry.status === "IN_PROGRESS" ? "selected" : ""}>In Progress</option>
                        <option value="RESOLVED" ${enquiry.status === "RESOLVED" ? "selected" : ""}>Resolved</option>
                    </select>
                    <button type="button" class="status-update-btn" data-id="${enquiry.id}">Update</button>
                </div>
            </td>
            <td>
                <button type="button" class="view-btn" data-id="${enquiry.id}">View Details</button>
                <button type="button" class="delete-btn" data-id="${enquiry.id}">Delete</button>
            </td>`;
        tableBody.appendChild(row);
    });

    tableBody.querySelectorAll(".view-btn").forEach((button) => {
        button.addEventListener("click", () => openEnquiryModal(Number(button.dataset.id)));
    });
    tableBody.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", () => deleteEnquiry(Number(button.dataset.id)));
    });
    tableBody.querySelectorAll(".status-update-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const id = Number(button.dataset.id);
            const statusSelect = tableBody.querySelector(`.status-select[data-id="${id}"]`);
            updateEnquiryStatus(id, statusSelect?.value, button);
        });
    });
}

function displaySubscribers() {
    const tableBody = document.getElementById("subscriberTableBody");
    const noSubscribers = document.getElementById("noSubscribers");
    if (!tableBody || !noSubscribers) {
        return;
    }

    tableBody.innerHTML = "";
    noSubscribers.classList.toggle("show-empty", currentSubscribers.length === 0);

    currentSubscribers.forEach((subscriber, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${escapeHTML(subscriber.email)}</strong></td>
            <td>${escapeHTML(formatDateTime(subscriber.subscribedAt))}</td>
            <td><button type="button" class="delete-btn subscriber-delete" data-id="${subscriber.id}">Delete</button></td>`;
        tableBody.appendChild(row);
    });

    tableBody.querySelectorAll(".subscriber-delete").forEach((button) => {
        button.addEventListener("click", () => deleteSubscriber(Number(button.dataset.id)));
    });
}

function displayNotices() {
    const tableBody = document.getElementById("noticeTableBody");
    const noNotices = document.getElementById("noNotices");
    if (!tableBody || !noNotices) {
        return;
    }

    tableBody.innerHTML = "";
    noNotices.classList.toggle("show-empty", currentNotices.length === 0);

    currentNotices.forEach((notice) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${escapeHTML(notice.title)}</strong></td>
            <td><span class="enquiry-badge">${escapeHTML(formatNoticeCategory(notice.category))}</span></td>
            <td>${escapeHTML(formatNoticeDate(notice.noticeDate))}</td>
            <td class="notice-description-cell">${escapeHTML(notice.description)}</td>
            <td>
                <button type="button" class="notice-edit-btn" data-id="${notice.id}">Edit</button>
                <button type="button" class="delete-btn notice-delete-btn" data-id="${notice.id}">Delete</button>
            </td>`;
        tableBody.appendChild(row);
    });

    tableBody.querySelectorAll(".notice-edit-btn").forEach((button) => {
        button.addEventListener("click", () => startNoticeEdit(Number(button.dataset.id)));
    });
    tableBody.querySelectorAll(".notice-delete-btn").forEach((button) => {
        button.addEventListener("click", () => deleteNotice(Number(button.dataset.id)));
    });
}

function displayCourses() {
    const tableBody = document.getElementById("courseTableBody");
    const noCourses = document.getElementById("noCourses");
    if (!tableBody || !noCourses) {
        return;
    }

    tableBody.innerHTML = "";
    noCourses.classList.toggle("show-empty", currentCourses.length === 0);

    currentCourses.forEach((course) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${escapeHTML(course.name)}</strong></td>
            <td>${escapeHTML(course.department)}</td>
            <td>${escapeHTML(course.duration)}</td>
            <td><span class="enquiry-badge">${escapeHTML(formatCourseType(course.courseType))}</span></td>
            <td class="notice-description-cell">${escapeHTML(course.description)}</td>
            <td>
                <button type="button" class="course-edit-btn" data-id="${course.id}">Edit</button>
                <button type="button" class="delete-btn course-delete-btn" data-id="${course.id}">Delete</button>
            </td>`;
        tableBody.appendChild(row);
    });

    tableBody.querySelectorAll(".course-edit-btn").forEach((button) => {
        button.addEventListener("click", () => startCourseEdit(Number(button.dataset.id)));
    });
    tableBody.querySelectorAll(".course-delete-btn").forEach((button) => {
        button.addEventListener("click", () => deleteCourse(Number(button.dataset.id)));
    });
}

async function deleteEnquiry(id) {
    if (!confirm("Are you sure you want to delete this enquiry?")) {
        return;
    }
    try {
        await apiRequest(`/admin/enquiries/${id}`, { method: "DELETE" });
        await Promise.all([refreshDashboard(), loadEnquiries()]);
    } catch (error) {
        alert(error.message);
    }
}

async function deleteSubscriber(id) {
    if (!confirm("Delete this subscriber?")) {
        return;
    }
    try {
        await apiRequest(`/admin/subscribers/${id}`, { method: "DELETE" });
        await Promise.all([refreshDashboard(), loadSubscribers()]);
    } catch (error) {
        alert(error.message);
    }
}

function setNoticeFormMessage(message = "", isError = false) {
    const messageElement = document.getElementById("noticeFormMessage");
    if (!messageElement) {
        return;
    }
    messageElement.textContent = message;
    messageElement.classList.toggle("error-message", isError);
}

function resetNoticeForm() {
    const noticeForm = document.getElementById("noticeForm");
    const noticeId = document.getElementById("noticeId");
    const submitButton = document.getElementById("noticeSubmitBtn");
    const cancelButton = document.getElementById("cancelNoticeEdit");

    noticeForm?.reset();
    if (noticeId) {
        noticeId.value = "";
    }
    if (submitButton) {
        submitButton.textContent = "Publish Notice";
    }
    if (cancelButton) {
        cancelButton.hidden = true;
    }
    setNoticeFormMessage();
}

function startNoticeEdit(id) {
    const notice = currentNotices.find((item) => item.id === id);
    if (!notice) {
        return;
    }

    document.getElementById("noticeId").value = notice.id;
    document.getElementById("noticeTitle").value = notice.title;
    document.getElementById("noticeCategory").value = notice.category;
    document.getElementById("noticeDate").value = notice.noticeDate;
    document.getElementById("noticeDescription").value = notice.description;
    document.getElementById("noticeSubmitBtn").textContent = "Update Notice";
    document.getElementById("cancelNoticeEdit").hidden = false;
    setNoticeFormMessage("Editing this notice. Save when you are ready.");
    document.getElementById("noticeTitle").focus();
}

async function saveNotice(event) {
    event.preventDefault();

    const noticeForm = document.getElementById("noticeForm");
    if (!noticeForm?.reportValidity()) {
        return;
    }

    const noticeId = document.getElementById("noticeId").value;
    const submitButton = document.getElementById("noticeSubmitBtn");
    const defaultButtonText = submitButton.textContent;
    const noticeData = {
        title: document.getElementById("noticeTitle").value.trim(),
        category: document.getElementById("noticeCategory").value,
        noticeDate: document.getElementById("noticeDate").value,
        description: document.getElementById("noticeDescription").value.trim()
    };

    submitButton.disabled = true;
    submitButton.textContent = noticeId ? "Updating..." : "Publishing...";
    setNoticeFormMessage();

    try {
        await apiRequest(
            noticeId ? `/admin/notices/${noticeId}` : "/admin/notices",
            {
                method: noticeId ? "PUT" : "POST",
                body: JSON.stringify(noticeData)
            }
        );
        resetNoticeForm();
        setNoticeFormMessage(
            noticeId ? "Notice updated successfully." : "Notice published successfully."
        );
        await loadNotices();
    } catch (error) {
        setNoticeFormMessage(error.message || "Unable to save the notice.", true);
    } finally {
        submitButton.disabled = false;
        if (document.getElementById("noticeId").value === noticeId) {
            submitButton.textContent = defaultButtonText;
        }
    }
}

async function deleteNotice(id) {
    if (!confirm("Delete this notice?")) {
        return;
    }

    try {
        await apiRequest(`/admin/notices/${id}`, { method: "DELETE" });
        if (String(id) === document.getElementById("noticeId")?.value) {
            resetNoticeForm();
        }
        await loadNotices();
    } catch (error) {
        alert(error.message);
    }
}

function setCourseFormMessage(message = "", isError = false) {
    const messageElement = document.getElementById("courseFormMessage");
    if (!messageElement) {
        return;
    }
    messageElement.textContent = message;
    messageElement.classList.toggle("error-message", isError);
}

function resetCourseForm() {
    const courseForm = document.getElementById("courseForm");
    const courseId = document.getElementById("courseId");
    const submitButton = document.getElementById("courseSubmitBtn");
    const cancelButton = document.getElementById("cancelCourseEdit");

    courseForm?.reset();
    if (courseId) {
        courseId.value = "";
    }
    if (submitButton) {
        submitButton.textContent = "Add Course";
    }
    if (cancelButton) {
        cancelButton.hidden = true;
    }
    setCourseFormMessage();
}

function startCourseEdit(id) {
    const course = currentCourses.find((item) => item.id === id);
    if (!course) {
        return;
    }

    document.getElementById("courseId").value = course.id;
    document.getElementById("courseName").value = course.name;
    document.getElementById("courseDepartment").value = course.department;
    document.getElementById("courseDuration").value = course.duration;
    document.getElementById("courseType").value = course.courseType;
    document.getElementById("courseDescription").value = course.description;
    document.getElementById("courseSubmitBtn").textContent = "Update Course";
    document.getElementById("cancelCourseEdit").hidden = false;
    setCourseFormMessage("Editing this course. Save when you are ready.");
    document.getElementById("courseName").focus();
}

async function saveCourse(event) {
    event.preventDefault();

    const courseForm = document.getElementById("courseForm");
    if (!courseForm?.reportValidity()) {
        return;
    }

    const courseId = document.getElementById("courseId").value;
    const submitButton = document.getElementById("courseSubmitBtn");
    const defaultButtonText = submitButton.textContent;
    const courseData = {
        name: document.getElementById("courseName").value.trim(),
        department: document.getElementById("courseDepartment").value.trim(),
        duration: document.getElementById("courseDuration").value.trim(),
        courseType: document.getElementById("courseType").value,
        description: document.getElementById("courseDescription").value.trim()
    };

    submitButton.disabled = true;
    submitButton.textContent = courseId ? "Updating..." : "Adding...";
    setCourseFormMessage();

    try {
        await apiRequest(
            courseId ? `/admin/courses/${courseId}` : "/admin/courses",
            {
                method: courseId ? "PUT" : "POST",
                body: JSON.stringify(courseData)
            }
        );
        resetCourseForm();
        setCourseFormMessage(
            courseId ? "Course updated successfully." : "Course added successfully."
        );
        await loadCourses();
    } catch (error) {
        setCourseFormMessage(error.message || "Unable to save the course.", true);
    } finally {
        submitButton.disabled = false;
        if (document.getElementById("courseId").value === courseId) {
            submitButton.textContent = defaultButtonText;
        }
    }
}

async function deleteCourse(id) {
    if (!confirm("Delete this course?")) {
        return;
    }

    try {
        await apiRequest(`/admin/courses/${id}`, { method: "DELETE" });
        if (String(id) === document.getElementById("courseId")?.value) {
            resetCourseForm();
        }
        await loadCourses();
    } catch (error) {
        alert(error.message);
    }
}

async function updateEnquiryStatus(id, status, button) {
    if (!status) {
        return;
    }

    const defaultButtonText = button.textContent;
    button.disabled = true;
    button.textContent = "Saving...";

    try {
        const updatedEnquiry = await apiRequest(`/admin/enquiries/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status })
        });
        currentEnquiries = currentEnquiries.map((enquiry) =>
            enquiry.id === id ? updatedEnquiry : enquiry
        );
        displayEnquiries();
    } catch (error) {
        alert(error.message);
        button.disabled = false;
        button.textContent = defaultButtonText;
    }
}

function openEnquiryModal(id) {
    const enquiry = currentEnquiries.find((item) => item.id === id);
    const enquiryModal = document.getElementById("enquiryModal");
    if (!enquiry || !enquiryModal) {
        return;
    }

    setText("modalName", enquiry.fullName);
    setText("modalEmail", enquiry.email);
    setText("modalMobile", enquiry.mobile);
    setText("modalType", formatEnquiryType(enquiry.enquiryType));
    setText("modalStatus", formatStatus(enquiry.status));
    setText("modalDate", formatDateTime(enquiry.createdAt));
    setText("modalMessage", enquiry.message);
    enquiryModal.classList.add("show-modal");
    document.body.style.overflow = "hidden";
}

function closeEnquiryModal() {
    const enquiryModal = document.getElementById("enquiryModal");
    if (enquiryModal) {
        enquiryModal.classList.remove("show-modal");
    }
    document.body.style.overflow = "";
}

async function clearEnquiries() {
    if (!currentEnquiries.length) {
        alert("There are no enquiries to clear.");
        return;
    }
    if (!confirm("Delete all enquiries? This cannot be undone.")) {
        return;
    }
    try {
        await Promise.all(currentEnquiries.map((enquiry) => apiRequest(`/admin/enquiries/${enquiry.id}`, { method: "DELETE" })));
        await Promise.all([refreshDashboard(), loadEnquiries()]);
    } catch (error) {
        alert(error.message);
    }
}

async function clearSubscribers() {
    if (!currentSubscribers.length) {
        alert("There are no subscribers to clear.");
        return;
    }
    if (!confirm("Delete all newsletter subscribers?")) {
        return;
    }
    try {
        await Promise.all(currentSubscribers.map((subscriber) => apiRequest(`/admin/subscribers/${subscriber.id}`, { method: "DELETE" })));
        await Promise.all([refreshDashboard(), loadSubscribers()]);
    } catch (error) {
        alert(error.message);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const searchEnquiry = document.getElementById("searchEnquiry");
    const clearEnquiriesButton = document.getElementById("clearEnquiries");
    const clearSubscribersButton = document.getElementById("clearSubscribers");
    const courseForm = document.getElementById("courseForm");
    const cancelCourseEdit = document.getElementById("cancelCourseEdit");
    const noticeForm = document.getElementById("noticeForm");
    const cancelNoticeEdit = document.getElementById("cancelNoticeEdit");
    const modalClose = document.getElementById("modalClose");
    const enquiryModal = document.getElementById("enquiryModal");
    const logoutButton = document.getElementById("logoutBtn");

    try {
        await Promise.all([refreshDashboard(), loadEnquiries(), loadSubscribers(), loadCourses(), loadNotices()]);
    } catch (error) {
        alert(error.message || "Unable to load dashboard data.");
    }

    let searchTimer;
    searchEnquiry?.addEventListener("input", () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            loadEnquiries(searchEnquiry.value).catch((error) => alert(error.message));
        }, 250);
    });

    clearEnquiriesButton?.addEventListener("click", clearEnquiries);
    clearSubscribersButton?.addEventListener("click", clearSubscribers);
    courseForm?.addEventListener("submit", saveCourse);
    cancelCourseEdit?.addEventListener("click", resetCourseForm);
    noticeForm?.addEventListener("submit", saveNotice);
    cancelNoticeEdit?.addEventListener("click", resetNoticeForm);
    modalClose?.addEventListener("click", closeEnquiryModal);
    enquiryModal?.addEventListener("click", (event) => {
        if (event.target === enquiryModal) {
            closeEnquiryModal();
        }
    });
    logoutButton?.addEventListener("click", () => {
        if (confirm("Are you sure you want to logout?")) {
            sessionStorage.removeItem("rgpvAdminToken");
            sessionStorage.removeItem("rgpvAdminLoggedIn");
            window.location.replace("login.html");
        }
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeEnquiryModal();
    }
});
