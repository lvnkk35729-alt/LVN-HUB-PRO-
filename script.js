// LVN.HUB PRO
// Frontend demo only.
// For a real public site, authentication and code storage
// should be handled by a secure backend.

const USER = {
    username: "LVN.HUB",
    password: "LAVAN KOUSHIK 31"
};

const ADMIN = {
    username: "LVN.ADMIN",
    password: "LAVANKOUSHIK41"
};

// -------------------------
// PAGE HELPERS
// -------------------------

function hideAllPages() {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });
}

function showPage(id) {
    hideAllPages();
    document.getElementById(id).classList.remove("hidden");
}

// -------------------------
// USER LOGIN
// -------------------------

document.getElementById("loginForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("loginMessage");

    if (
        username === USER.username &&
        password === USER.password
    ) {

        sessionStorage.setItem("LVN_SESSION", "user");

        message.textContent = "";

        showPage("dashboardPage");

    } else {

        message.textContent =
            "Invalid username or password.";

    }

});

// -------------------------
// ADMIN LOGIN
// -------------------------

function showAdminLogin() {

    showPage("adminLoginPage");

}

function showUserLogin() {

    showPage("loginPage");

}

document.getElementById("adminForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const username =
        document.getElementById("adminUsername").value.trim();

    const password =
        document.getElementById("adminPassword").value;

    const message =
        document.getElementById("adminMessage");

    if (
        username === ADMIN.username &&
        password === ADMIN.password
    ) {

        sessionStorage.setItem("LVN_SESSION", "admin");

        message.textContent = "";

        showPage("adminPage");

        refreshCodes();

    } else {

        message.textContent =
            "Invalid admin credentials.";

    }

});

// -------------------------
// LOGOUT
// -------------------------

function logout() {

    sessionStorage.removeItem("LVN_SESSION");

    showPage("loginPage");

}

// -------------------------
// CODE STORAGE
// -------------------------

function getCodes() {

    return JSON.parse(
        localStorage.getItem("LVN_CODES") || "[]"
    );

}

function saveCodes(codes) {

    localStorage.setItem(
        "LVN_CODES",
        JSON.stringify(codes)
    );

}

// -------------------------
// ADMIN: ADD CODE
// -------------------------

function addCode() {

    const input =
        document.getElementById("newCode");

    const code =
        input.value.trim();

    if (!code) {

        alert("Please enter a code.");

        return;

    }

    const codes = getCodes();

    codes.push({

        code: code,

        status: "AVAILABLE",

        created: new Date().toLocaleString()

    });

    saveCodes(codes);

    input.value = "";

    refreshCodes();

}

// -------------------------
// ADMIN: VIEW CODES
// -------------------------

function refreshCodes() {

    const list =
        document.getElementById("codeList");

    if (!list) return;

    const codes = getCodes();

    if (codes.length === 0) {

        list.innerHTML =
            "<p>No codes added yet.</p>";

        return;

    }

    list.innerHTML = codes.map((item, index) => {

        return `
            <div class="code-display">

                <div>${escapeHTML(item.code)}</div>

                <small>
                    Status:
                    ${escapeHTML(item.status)}
                </small>

                <br><br>

                <button
                    onclick="deleteCode(${index})"
                    style="
                        background:#ff405d;
                        color:white;
                        padding:10px 15px;
                        border-radius:8px;
                    "
                >
                    DELETE
                </button>

            </div>
        `;

    }).join("");

}

// -------------------------
// ADMIN: DELETE CODE
// -------------------------

function deleteCode(index) {

    const codes = getCodes();

    codes.splice(index, 1);

    saveCodes(codes);

    refreshCodes();

}

// -------------------------
// USER: GENERATE CODE
// -------------------------

function generateCode() {

    const codes = getCodes();

    const available =
        codes.find(
            item => item.status === "AVAILABLE"
        );

    const box =
        document.getElementById("contentBox");

    if (!available) {

        box.innerHTML = `
            <h2>No Code Available</h2>

            <p>
                There are currently no available
                administrator-provided codes.
            </p>
        `;

        return;

    }

    // Mark code as used.

    available.status = "USED";

    available.usedAt =
        new Date().toLocaleString();

    saveCodes(codes);

    box.innerHTML = `
        <h2>🔑 Your Code</h2>

        <div class="code-display">
            ${escapeHTML(available.code)}
        </div>

        <p>
            This code has been marked as
            <strong>USED</strong>.
        </p>
    `;

}

// -------------------------
// WHAT'S THE USE?
// -------------------------

function showUse() {

    const box =
        document.getElementById("contentBox");

    box.innerHTML = `

        <h2>📖 What's the Use?</h2>

        <p>
            LVN.HUB PRO uses administrator-managed
            access codes for controlled access to
            your own services, projects, or
            cybersecurity learning resources.
        </p>

        <br>

        <p>
            Codes are manually added by the
            administrator and are not randomly
            generated.
        </p>

        <br>

        <p>
            Once a code is issued, it is marked
            as used in this demo.
        </p>

    `;

}

// -------------------------
// PROFILE
// -------------------------

function showProfile() {

    const box =
        document.getElementById("contentBox");

    box.innerHTML = `

        <h2>👤 Profile</h2>

        <p>
            <strong>Username:</strong>
            LVN.HUB
        </p>

        <p>
            <strong>Account:</strong>
            User
        </p>

        <p>
            <strong>Portal:</strong>
            LVN.HUB PRO
        </p>

        <br>

        <p>
            Cybersecurity learning and
            administrator-managed code portal.
        </p>

    `;

}

// -------------------------
// BASIC HTML ESCAPING
// -------------------------

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

// -------------------------
// INITIAL PAGE
// -------------------------

window.addEventListener("load", function() {

    const session =
        sessionStorage.getItem("LVN_SESSION");

    if (session === "user") {

        showPage("dashboardPage");

    } else if (session === "admin") {

        showPage("adminPage");

        refreshCodes();

    } else {

        showPage("loginPage");

    }

});
