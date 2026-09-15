import httpRequest from "./utils/httpRequest.js";
import showToast from "./utils/customToast.js";

// Auth Modal Functionality
document.addEventListener("DOMContentLoaded", function () {
    // Get DOM elements
    const signupBtn = document.querySelector(".signup-btn");
    const loginBtn = document.querySelector(".login-btn");
    const authModal = document.getElementById("authModal");
    const modalClose = document.getElementById("modalClose");
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    const showLoginBtn = document.getElementById("showLogin");
    const showSignupBtn = document.getElementById("showSignup");

    // Function to show signup form
    function showSignupForm() {
        signupForm.style.display = "block";
        loginForm.style.display = "none";
    }

    // Function to show login form
    function showLoginForm() {
        signupForm.style.display = "none";
        loginForm.style.display = "block";
    }

    // Function to open modal
    function openModal() {
        authModal.classList.add("show");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    // Open modal with Sign Up form when clicking Sign Up button
    signupBtn.addEventListener("click", function () {
        showSignupForm();
        openModal();
    });

    // Open modal with Login form when clicking Login button
    loginBtn.addEventListener("click", function () {
        showLoginForm();
        openModal();
    });

    // Password Eye
    document.querySelectorAll(".password-eye").forEach((element) => {
        element.addEventListener("click", () => {
            const input = element.closest(".form-group").querySelector("input");
            if (input.type === "password") {
                input.type = "text";
                element.innerHTML = '<i class="fa-solid fa-eye"></i>';
            } else {
                input.type = "password";
                element.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
            }
        });
    });

    // Close modal function
    function closeModal() {
        authModal.classList.remove("show");
        document.body.style.overflow = "auto"; // Restore scrolling
    }

    // Close modal when clicking close button
    modalClose.addEventListener("click", closeModal);

    // Close modal when clicking overlay (outside modal container)
    authModal.addEventListener("click", function (e) {
        if (e.target === authModal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && authModal.classList.contains("show")) {
            closeModal();
        }
    });

    // Switch to Login form
    showLoginBtn.addEventListener("click", function () {
        showLoginForm();
    });

    // Switch to Signup form
    showSignupBtn.addEventListener("click", function () {
        showSignupForm();
    });

    // Sign up action
    signupForm
        .querySelector(".auth-form-content")
        .addEventListener("submit", async (event) => {
            event.preventDefault();
            const email = event.target.querySelector("#signupEmail").value;
            const password =
                event.target.querySelector("#signupPassword").value;

            const credentials = {
                email,
                password,
            };

            try {
                const { user, access_token } = await httpRequest.post(
                    `auth/register`,
                    credentials,
                );
                localStorage.setItem("accessToken", access_token);
                closeModal();
                showUserDetails();
                showToast(
                    `Welcome aboard! Your account on Spotify is ready.`,
                    "success",
                );
            } catch (error) {
                const emailForm = event.target
                    .querySelector("#signupEmail")
                    .closest(".form-group");
                const passwordForm = event.target
                    .querySelector("#signupPassword")
                    .closest(".form-group");
                emailForm.classList.remove("invalid");
                passwordForm.classList.remove("invalid");
                const e = error?.response?.error;
                if (e) {
                    let emailMessage = "",
                        passwordMessage = "";
                    if (e.code === "VALIDATION_ERROR") {
                        e.details.forEach((element) => {
                            if (element.field === "password") {
                                passwordMessage += `<div class="error-detail">
                                        <i class="fas fa-info-circle"></i>
                                        <span>
                                            ${element.message}
                                        </span>
                                    </div>`;
                            } else if (element.field === "email") {
                                emailMessage += `<div class="error-detail">
                                        <i class="fas fa-info-circle"></i>
                                        <span>
                                            ${element.message}
                                        </span>
                                    </div>`;
                            }
                        });
                    } else if (e.code === "EMAIL_EXISTS") {
                        emailMessage += `<div class="error-detail">
                                        <i class="fas fa-info-circle"></i>
                                        <span>
                                            ${e.message}
                                        </span>
                                    </div>`;
                    }

                    if (emailMessage) {
                        emailForm.querySelector(".error-message").innerHTML =
                            emailMessage;
                        emailForm.classList.add("invalid");
                    }
                    if (passwordMessage) {
                        passwordForm.querySelector(".error-message").innerHTML =
                            passwordMessage;
                        passwordForm.classList.add("invalid");
                    }
                }
                return;
            }
        });

    // Log in action
    loginForm
        .querySelector(".auth-form-content")
        .addEventListener("submit", async (event) => {
            event.preventDefault();
            const email = event.target.querySelector("#loginEmail").value;
            const password = event.target.querySelector("#loginPassword").value;

            const credentials = {
                email,
                password,
            };

            try {
                const { user, access_token } = await httpRequest.post(
                    "auth/login",
                    credentials,
                );
                localStorage.setItem("accessToken", access_token);
                closeModal();
                showUserDetails();
                showToast("Successfully logged in!", "success");
            } catch (error) {
                const emailForm = event.target
                    .querySelector("#loginEmail")
                    .closest(".form-group");
                const passwordForm = event.target
                    .querySelector("#loginPassword")
                    .closest(".form-group");
                emailForm.classList.remove("invalid");
                passwordForm.classList.remove("invalid");
                const e = error?.response?.error;
                if (e) {
                    let emailMessage = "",
                        passwordMessage = "";
                    if (e.code === "INVALID_CREDENTIALS") {
                        passwordMessage += `<div class="error-detail">
                                        <i class="fas fa-info-circle"></i>
                                        <span>
                                            ${e.message}
                                        </span>
                                    </div>`;
                        emailMessage += `<div class="error-detail"></div>`;
                    } else if (e.code === "VALIDATION_ERROR") {
                        e.details.forEach((element) => {
                            if (element.field === "password") {
                                passwordMessage += `<div class="error-detail">
                                        <i class="fas fa-info-circle"></i>
                                        <span>
                                            ${element.message}
                                        </span>
                                    </div>`;
                            } else if (element.field === "email") {
                                emailMessage += `<div class="error-detail">
                                        <i class="fas fa-info-circle"></i>
                                        <span>
                                            ${element.message}
                                        </span>
                                    </div>`;
                            }
                        });
                    }
                    if (emailMessage) {
                        emailForm.querySelector(".error-message").innerHTML =
                            emailMessage;
                        emailForm.classList.add("invalid");
                    }
                    if (passwordMessage) {
                        passwordForm.querySelector(".error-message").innerHTML =
                            passwordMessage;
                        passwordForm.classList.add("invalid");
                    }
                }
                return;
            }
        });
});

// User Menu Dropdown Functionality
document.addEventListener("DOMContentLoaded", function () {
    const userAvatar = document.getElementById("userAvatar");
    const userDropdown = document.getElementById("userDropdown");
    const logoutBtn = document.getElementById("logoutBtn");

    // Toggle dropdown when clicking avatar
    userAvatar.addEventListener("click", function (e) {
        e.stopPropagation();
        userDropdown.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
        if (
            !userAvatar.contains(e.target) &&
            !userDropdown.contains(e.target)
        ) {
            userDropdown.classList.remove("show");
        }
    });

    // Close dropdown when pressing Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && userDropdown.classList.contains("show")) {
            userDropdown.classList.remove("show");
        }
    });

    // Handle logout button click
    logoutBtn.addEventListener("click", async () => {
        // Close dropdown first
        userDropdown.classList.remove("show");

        // TODO: Students will implement logout logic here
        try {
            const response = await httpRequest.post("auth/logout");
            localStorage.setItem("accessToken", "");
            showUserDetails();
            showToast("Successfully logged out!", "success");
            setTimeout(() => {
                window.location.href = "/";
            }, 2000);
        } catch (error) {
            showToast("Logout failed on the server.", "error");
        }
    });
});

async function showUserDetails() {
    const authButtons = document.querySelector(".auth-buttons");
    const userMenu = document.querySelector(".user-menu");
    try {
        const { user } = await httpRequest.get("users/me");
        const img = document.querySelector("#userAvatar img");
        const userEmail = document.querySelector(".user-email");

        userMenu.classList.add("show");
        authButtons.classList.remove("show");

        if (user.avatar_url) img.src = user.avatar_url;
        if (user.email) userEmail.innerText = user.email;
    } catch (error) {
        authButtons.classList.add("show");
        userMenu.classList.remove("show");
    }
}

function enableToolTip(delayTime = 300, offset = 5) {
    const toolTip = document.querySelector("#global-tooltip");

    let hoverTime = null;
    document.addEventListener("mouseover", (e) => {
        const target = e.target.closest("[data-tooltip]");
        if (!target) return;

        const toolTipText = target.getAttribute("data-tooltip");
        const toolTipDir = target.getAttribute("data-tooltip-dir");
        hoverTime = setTimeout(() => {
            toolTip.innerText = toolTipText;

            const rect = target.getBoundingClientRect();
            const toolTipRect = toolTip.getBoundingClientRect();

            const topPosition =
                toolTipDir === "top"
                    ? rect.top - toolTipRect.height - offset
                    : rect.bottom + offset;
            const leftPosition =
                rect.left + rect.width / 2 - toolTipRect.width / 2;
            const rightPosition =
                window.innerWidth -
                rect.right +
                rect.width / 2 -
                toolTipRect.width / 2;
            if (leftPosition < 0) toolTip.style.left = `8px`;
            else if (rightPosition < 0) toolTip.style.right = `8px`;
            else toolTip.style.left = `${leftPosition}px`;

            toolTip.style.top = `${topPosition}px`;
            toolTip.classList.add("active");
        }, delayTime);
    });
    document.addEventListener("mouseout", (e) => {
        const target = e.target.closest("[data-tooltip]");
        if (!target) return;

        clearTimeout(hoverTime);
        toolTip.classList.remove("active");
        toolTip.style.top = toolTip.style.left = toolTip.style.right = null;
    });
}

function loadLibraryContent() {
    const libraryContainer = document.querySelector(".library-content");

    const likedSongs = document.createElement("div");
    likedSongs.className = "library-item active";
    likedSongs.innerHTML = ``;
}

function enableLibraryFunction() {
    const sortBtn = document.querySelector(".sort-btn");
    const sortAndViewPicker = document.querySelector("#sort-and-view-picker");

    sortBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        const isOpen = sortAndViewPicker.classList.toggle("active");

        if (isOpen) {
            const sortBtnRect = sortBtn.getBoundingClientRect();
            sortAndViewPicker.style.top = `${sortBtnRect.height + 5}px`;
        }
    });

    document.addEventListener("click", (e) => {
        if (
            sortAndViewPicker.classList.contains("active") &&
            !sortAndViewPicker.contains(e.target) &&
            !sortBtn.contains(e.target)
        ) {
            sortAndViewPicker.classList.remove("active");
        }
    });

    // Sort buttons
    {
        const sortList = sortAndViewPicker.querySelector(".sort-list");
        const sortText = sortBtn.querySelector("span");
        let prevElement = sortList.querySelector("li:not(.section-title)");
        const checkIcon = document.createElement("i");
        checkIcon.className = "fa-solid fa-check check-icon";
        prevElement.classList.add("active");
        prevElement.appendChild(checkIcon);
        sortList.addEventListener("click", (e) => {
            const element = e.target.closest("li");
            if (element.classList.contains("section-title")) return;
            if (element.classList.contains("active")) return;

            prevElement.classList.remove("active");
            element.appendChild(checkIcon);
            element.classList.add("active");
            const curText = element.querySelector("span").innerText;
            sortText.innerText = curText;

            prevElement = element;
        });
    }
    // View buttons
    {
        const viewMode = sortAndViewPicker.querySelector(".view-modes");
        const iconContainer = sortBtn.querySelector(".icon");
        let prevElement = viewMode.querySelector("button:nth-child(2)");
        prevElement.classList.add("active");
        iconContainer.innerHTML = prevElement.innerHTML;
        let currentMode = prevElement.getAttribute("aria-label");
        displayOnViewMode();
        viewMode.addEventListener("click", (e) => {
            const element = e.target.closest(".view-btn");
            if (!element || element === prevElement) return;

            prevElement.classList.remove("active");
            element.classList.add("active");
            currentMode = element.getAttribute("aria-label");
            iconContainer.innerHTML = element.innerHTML;
            displayOnViewMode();
            prevElement = element;
        });

        function displayOnViewMode() {
            console.log(currentMode);
        }
    }
}

// Other functionality
document.addEventListener("DOMContentLoaded", async () => {
    // Disable context menu
    document.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });

    showUserDetails();
    enableToolTip();
    loadLibraryContent();
    enableLibraryFunction();
});
