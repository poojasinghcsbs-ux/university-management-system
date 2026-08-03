const API_BASE_URL = "http://localhost:8080/api";
const adminToken = sessionStorage.getItem("rgpvAdminToken");

if (!adminToken) {
    window.location.replace("login.html");
}

let currentEnquiries = [];
let currentSubscribers = [];

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

function formatDateTime(value) {
    if (!value) {
        return "-";
    }
    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date(value));
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

function openEnquiryModal(id) {
    const enquiry = currentEnquiries.find((item) => item.id === id);
    const enquiryModal = document.getElementById("enquiryModal");
    if (!enquiry || !enquiryModal) {
        return;
    }

    setText("modalName", enquiry.fullName);
    setText("modalEmail", enquiry.email);
    setText("modalMobile", enquiry.mobile);
    setText("modalType", `${formatEnquiryType(enquiry.enquiryType)} (${enquiry.status})`);
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
    const modalClose = document.getElementById("modalClose");
    const enquiryModal = document.getElementById("enquiryModal");
    const logoutButton = document.getElementById("logoutBtn");

    try {
        await Promise.all([refreshDashboard(), loadEnquiries(), loadSubscribers()]);
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
