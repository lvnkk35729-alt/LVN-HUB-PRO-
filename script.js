// ========================================
// LVN.HUB PRO
// DEMO / LOCAL VERSION
// ========================================

// Demo login details
const USER_USERNAME = "LVN.HUB";
const USER_PASSWORD = "LAVAN KOUSHIK 31";

const ADMIN_USERNAME = "LVN.ADMIN";
const ADMIN_PASSWORD = "LAVANKOUSHIK41";

let licenseTimerInterval = null;


// ========================================
// PAGE CONTROL
// ========================================

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(function(page) {
        page.classList.add("hidden");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.remove("hidden");
    }
}


// ========================================
// USER ID
// ========================================

function getUserId() {

    let userId = localStorage.getItem("LVN_USER_ID");

    if (!userId) {

        userId = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        localStorage.setItem(
            "LVN_USER_ID",
            userId
        );
    }

    return userId;
}


// ========================================
// LICENSE STORAGE
// ========================================

function getLicense() {

    try {

        return JSON.parse(
            localStorage.getItem("LVN_LICENSE") || "null"
        );

    } catch (error) {

        return null;
    }
}


function saveLicense(license) {

    localStorage.setItem(
        "LVN_LICENSE",
        JSON.stringify(license)
    );
}


// ========================================
// USER LOGIN
// ========================================

document
    .getElementById("loginForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value;

        const message =
            document.getElementById("loginMessage");


        if (
            username === USER_USERNAME &&
            password === USER_PASSWORD
        ) {

            sessionStorage.setItem(
                "LVN_SESSION",
                "user"
            );

            message.textContent = "";

            showPage("dashboardPage");

            loadUserDashboard();

        } else {

            message.textContent =
                "Invalid username or password.";
        }

    });


// ========================================
// ADMIN LOGIN PAGE
// ========================================

function showAdminLogin() {

    showPage("adminLoginPage");

    const message =
        document.getElementById("adminMessage");

    if (message) {
        message.textContent = "";
    }
}


// ========================================
// USER LOGIN PAGE
// ========================================

function showUserLogin() {

    showPage("loginPage");

    const message =
        document.getElementById("loginMessage");

    if (message) {
        message.textContent = "";
    }
}


// ========================================
// ADMIN LOGIN
// ========================================

document
    .getElementById("adminForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const username =
            document
                .getElementById("adminUsername")
                .value.trim();

        const password =
            document.getElementById("adminPassword").value;

        const message =
            document.getElementById("adminMessage");


        if (
            username === ADMIN_USERNAME &&
            password === ADMIN_PASSWORD
        ) {

            sessionStorage.setItem(
                "LVN_SESSION",
                "admin"
            );

            message.textContent = "";

            showPage("adminPage");

            refreshAdminPanel();

        } else {

            message.textContent =
                "Invalid admin username or password.";
        }

    });


// ========================================
// LOGOUT
// ========================================

function logout() {

    sessionStorage.removeItem(
        "LVN_SESSION"
    );

    if (licenseTimerInterval) {
        clearInterval(licenseTimerInterval);
        licenseTimerInterval = null;
    }

    showPage("loginPage");
}


// ========================================
// USER DASHBOARD
// ========================================

function loadUserDashboard() {

    const userId =
        getUserId();

    const userIdDisplay =
        document.getElementById("userIdDisplay");

    if (userIdDisplay) {
        userIdDisplay.textContent =
            userId;
    }

    updateLicenseDisplay();
}


// ========================================
// LICENSE DISPLAY
// ========================================

function updateLicenseDisplay() {

    const license =
        getLicense();

    const status =
        document.getElementById("licenseStatus");

    const badge =
        document.getElementById("licenseBadge");

    const keyDisplay =
        document.getElementById("licenseKeyDisplay");

    const timer =
        document.getElementById("licenseTimer");


    if (!status || !badge || !keyDisplay || !timer) {
        return;
    }


    if (!license) {

        status.textContent =
            "NO LICENSE";

        badge.textContent =
            "INACTIVE";

        keyDisplay.textContent =
            "NO LICENSE";

        timer.textContent =
            "--";

        return;
    }


    const remaining =
        license.expiresAt - Date.now();


    if (remaining <= 0) {

        license.status =
            "EXPIRED";

        saveLicense(license);


        status.textContent =
            "EXPIRED";

        badge.textContent =
            "EXPIRED";

        keyDisplay.textContent =
            license.code;

        timer.textContent =
            "00:00:00";

        if (licenseTimerInterval) {
            clearInterval(licenseTimerInterval);
            licenseTimerInterval = null;
        }

        return;
    }


    status.textContent =
        "ACTIVE";

    badge.textContent =
        "ACTIVE";

    keyDisplay.textContent =
        license.code;


    updateLicenseTimer(license.expiresAt);


    if (licenseTimerInterval) {
        clearInterval(licenseTimerInterval);
    }


    licenseTimerInterval =
        setInterval(function() {

            updateLicenseTimer(
                license.expiresAt
            );

        }, 1000);
}


// ========================================
// LICENSE TIMER
// ========================================

function updateLicenseTimer(expiresAt) {

    const timer =
        document.getElementById("licenseTimer");

    if (!timer) {
        return;
    }


    const remaining =
        expiresAt - Date.now();


    if (remaining <= 0) {

        timer.textContent =
            "00:00:00";

        updateLicenseDisplay();

        return;
    }


    const totalSeconds =
        Math.floor(
            remaining / 1000
        );


    const days =
        Math.floor(
            totalSeconds / 86400
        );

    const hours =
        Math.floor(
            (totalSeconds % 86400) / 3600
        );

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    const seconds =
        totalSeconds % 60;


    if (days > 0) {

        timer.textContent =
            `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;

    } else {

        timer.textContent =
            `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
}


function pad(number) {

    return String(number)
        .padStart(2, "0");
}


// ========================================
// ADMIN PANEL
// ========================================

function refreshAdminPanel() {

    displayUserId();

    displayLicense();

    updateUserCount();
}


// ========================================
// DISPLAY USER
// ========================================

function displayUserId() {

    const list =
        document.getElementById("userIdList");

    const count =
        document.getElementById("userCount");

    if (!list) {
        return;
    }


    const userId =
        getUserId();


    list.innerHTML = `

        <div class="user-item">

            <strong>
                USER ID: ${escapeHTML(userId)}
            </strong>

            <span>
                Registered User
            </span>

        </div>

    `;


    if (count) {
        count.textContent = "1";
    }
}


// ========================================
// USER SEARCH
// ========================================

function searchUsers() {

    const searchInput =
        document.getElementById("userSearch");

    const list =
        document.getElementById("userIdList");

    if (!searchInput || !list) {
        return;
    }


    const query =
        searchInput.value.trim();

    const userId =
        getUserId();


    if (
        query === "" ||
        userId.includes(query)
    ) {

        list.innerHTML = `

            <div class="user-item">

                <strong>
                    USER ID: ${escapeHTML(userId)}
                </strong>

                <span>
                    Registered User
                </span>

            </div>

        `;

    } else {

        list.innerHTML =
            "No matching users found.";
    }
}


function updateUserCount() {

    const count =
        document.getElementById("userCount");

    if (count) {
        count.textContent = "1";
    }
}


// ========================================
// SEND LICENSE
// ========================================

function sendLicense() {

    const userId =
        document
            .getElementById("licenseUserId")
            .value
            .trim();

    const code =
        document
            .getElementById("licenseCode")
            .value
            .trim();

    const duration =
        Number(
            document
                .getElementById("licenseDuration")
                .value
        );

    const message =
        document.getElementById("licenseMessage");


    if (!/^\d{6}$/.test(userId)) {

        message.textContent =
            "Enter a valid 6-digit User ID.";

        return;
    }


    if (userId !== getUserId()) {

        message.textContent =
            "User ID not found in this demo.";

        return;
    }


    if (!code) {

        message.textContent =
            "Enter a license code.";

        return;
    }


    if (!duration) {

        message.textContent =
            "Select a license duration.";

        return;
    }


    const license = {

        userId: userId,

        code: code,

        status: "ACTIVE",

        issuedAt: Date.now(),

        expiresAt:
            Date.now() + duration
    };


    saveLicense(license);

    message.textContent =
        "License sent successfully.";

    document.getElementById(
        "licenseCode"
    ).value = "";

    refreshLicenseList();
}


// ========================================
// LICENSE LIST
// ========================================

function refreshLicenseList() {

    const list =
        document.getElementById("licenseList");

    if (!list) {
        return;
    }


    const license =
        getLicense();


    if (!license) {

        list.innerHTML =
            "No licenses found.";

        return;
    }


    const expired =
        license.expiresAt <= Date.now();


    const status =
        expired
            ? "EXPIRED"
            : "ACTIVE";


    list.innerHTML = `

        <div class="license-item">

            <div>

                <strong>
                    ${escapeHTML(license.code)}
                </strong>

                <p>
                    User ID:
                    ${escapeHTML(license.userId)}
                </p>

            </div>

            <strong>
                ${status}
            </strong>

        </div>

    `;
}


// ========================================
// ADMIN LICENSE DISPLAY
// ========================================

function displayLicense() {

    refreshLicenseList();
}


// ========================================
// GENERATE / GET CODE
// ========================================

function generateCode() {

    const box =
        document.getElementById("contentBox");

    if (!box) {
        return;
    }


    const license =
        getLicense();


    if (!license) {

        box.innerHTML = `

            <h2>🔒 License Required</h2>

            <p>
                You do not currently have
                an active administrator-issued
                license.
            </p>

        `;

        return;
    }


    if (license.expiresAt <= Date.now()) {

        box.innerHTML = `

            <h2>⏰ License Expired</h2>

            <p>
                Your license has expired.
                Please contact the administrator.
            </p>

        `;

        updateLicenseDisplay();

        return;
    }


    box.innerHTML = `

        <h2>🔑 Access Code</h2>

        <div class="code-display">
            ${escapeHTML(license.code)}
        </div>

        <p>
            This is the administrator-provided
            access code assigned to your account.
        </p>

    `;
}


// ========================================
// WHAT'S THE USE?
// ========================================

function showUse() {

    const box =
        document.getElementById("contentBox");

    if (!box) {
        return;
    }


    box.innerHTML = `

        <h2>📖 What's the Use?</h2>

        <p>
            LVN.HUB PRO is a managed-access
            portal for your own projects,
            learning resources and services.
        </p>

        <br>

        <p>
            Administrators can assign
            time-limited license codes
            to registered users.
        </p>

        <br>

        <p>
            When the license expires,
            access is shown as expired.
        </p>

    `;
}


// ========================================
// PROFILE
// ========================================

function showProfile() {

    const box =
        document.getElementById("contentBox");

    if (!box) {
        return;
    }


    box.innerHTML = `

        <h2>👤 Profile</h2>

        <p>
            <strong>Username:</strong>
            ${escapeHTML(USER_USERNAME)}
        </p>

        <p>
            <strong>User ID:</strong>
            ${escapeHTML(getUserId())}
        </p>

        <p>
            <strong>Account:</strong>
            User
        </p>

        <p>
            <strong>Portal:</strong>
            LVN.HUB PRO
        </p>

    `;
}


// ========================================
// HTML ESCAPE
// ========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ========================================
// START WEBSITE
// ========================================

window.addEventListener(
    "load",
    function() {

        const session =
            sessionStorage.getItem(
                "LVN_SESSION"
            );


        if (session === "user") {

            showPage(
                "dashboardPage"
            );

            loadUserDashboard();

        }

        else if (session === "admin") {

            showPage(
                "adminPage"
            );

            refreshAdminPanel();

        }

        else {

            showPage(
                "loginPage"
            );
        }

    }
);
