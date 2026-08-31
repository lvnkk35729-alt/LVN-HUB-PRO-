// ========================================
// LVN.HUB PRO
// ========================================

// DEMO LOGIN DETAILS
const USER_USERNAME = "LVN.HUB";
const USER_PASSWORD = "LAVAN KOUSHIK 31";

const ADMIN_USERNAME = "LVN.ADMIN";
const ADMIN_PASSWORD = "LAVANKOUSHIK41";


// ========================================
// PAGE CONTROL
// ========================================

function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.add("hidden");
    });

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.remove("hidden");
    }
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

        } else {

            message.textContent =
                "Invalid username or password.";

        }

    });


// ========================================
// SHOW ADMIN LOGIN
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
// BACK TO USER LOGIN
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
                .value
                .trim();

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

            refreshCodes();

        } else {

            message.textContent =
                "Invalid admin username or password.";

        }

    });


// ========================================
// LOGOUT
// ========================================

function logout() {

    sessionStorage.removeItem("LVN_SESSION");

    showPage("loginPage");

}


// ========================================
// CODE STORAGE
// ========================================

function getCodes() {

    try {

        return JSON.parse(
            localStorage.getItem("LVN_CODES") || "[]"
        );

    } catch (error) {

        return [];

    }

}


function saveCodes(codes) {

    localStorage.setItem(
        "LVN_CODES",
        JSON.stringify(codes)
    );

}


// ========================================
// ADMIN - ADD CODE
// ========================================

function addCode() {

    const input =
        document.getElementById("newCode");

    if (!input) {
        return;
    }

    const code =
        input.value.trim();


    if (code === "") {

        alert("Please enter a code.");

        return;

    }


    const codes = getCodes();


    codes.push({

        code: code,

        status: "AVAILABLE",

        createdAt:
            new Date().toLocaleString()

    });


    saveCodes(codes);

    input.value = "";

    refreshCodes();

}


// ========================================
// ADMIN - DISPLAY CODES
// ========================================

function refreshCodes() {

    const list =
        document.getElementById("codeList");

    if (!list) {
        return;
    }


    const codes = getCodes();


    if (codes.length === 0) {

        list.innerHTML =
            "<p>No codes added yet.</p>";

        return;

    }


    list.innerHTML = "";


    codes.forEach(function(item, index) {

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "code-display";


        const codeText =
            document.createElement("div");

        codeText.textContent =
            item.code;


        const status =
            document.createElement("small");

        status.textContent =
            "Status: " + item.status;


        const deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "DELETE";


        deleteButton.style.background =
            "#ff405d";

        deleteButton.style.color =
            "#ffffff";

        deleteButton.style.padding =
            "10px 15px";

        deleteButton.style.borderRadius =
            "8px";

        deleteButton.style.marginTop =
            "12px";


        deleteButton.onclick =
            function() {

                deleteCode(index);

            };


        wrapper.appendChild(codeText);

        wrapper.appendChild(status);

        wrapper.appendChild(
            document.createElement("br")
        );

        wrapper.appendChild(deleteButton);

        list.appendChild(wrapper);

    });

}


// ========================================
// ADMIN - DELETE CODE
// ========================================

function deleteCode(index) {

    const codes = getCodes();


    if (
        index < 0 ||
        index >= codes.length
    ) {

        return;

    }


    codes.splice(index, 1);

    saveCodes(codes);

    refreshCodes();

}


// ========================================
// USER - GENERATE CODE
// ========================================

function generateCode() {

    const box =
        document.getElementById("contentBox");

    if (!box) {
        return;
    }


    const codes = getCodes();


    const availableCode =
        codes.find(function(item) {

            return item.status === "AVAILABLE";

        });


    if (!availableCode) {

        box.innerHTML = `

            <h2>🔒 No Code Available</h2>

            <p>
                No administrator-provided code
                is currently available.
            </p>

        `;

        return;

    }


    // Mark the selected code as USED.

    availableCode.status =
        "USED";

    availableCode.usedAt =
        new Date().toLocaleString();


    saveCodes(codes);


    box.innerHTML = `

        <h2>🔑 Your Code</h2>

        <div class="code-display">
            ${escapeHTML(availableCode.code)}
        </div>

        <p>
            This code has been marked as USED.
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
            LVN.HUB PRO uses
            administrator-managed access codes
            for controlled access to your own
            services, projects, or cybersecurity
            learning resources.
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
            as USED in this demo.
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

        }

        else if (session === "admin") {

            showPage(
                "adminPage"
            );

            refreshCodes();

        }

        else {

            showPage(
                "loginPage"
            );

        }

    }
);
