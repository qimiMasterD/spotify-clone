import httpRequest from "../utils/httpRequest.js";
import showToast from "../utils/customToast.js";
import { formatNumberIntl, formatSeconds } from "../utils/formating.js";

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

async function getLikedTracks() {
    const response = await httpRequest.get("me/tracks/liked?limit=50");
    return response.tracks.length;
}

async function getArtists(num, offset = 0) {
    const response = await httpRequest.get(
        `artists?limit=${num}&offset=${offset}`,
    );
    return response.artists;
}

async function getAlbums(num, offset = 0) {
    const response = await httpRequest.get(
        `albums?limit=${num}&offset=${offset}`,
    );
    return response.albums;
}

async function getPlaylists() {
    const response = await httpRequest.get(`me/playlists`);
    return response.playlists;
}

function updatePlaylist(id, data) {
    const playlist = document.querySelector(`.library-item[data-id='${id}']`);
    playlist.dataset.type = "Playlists";
    playlist.className = "library-item";
    playlist.dataset.id = data.id;
    playlist.innerHTML = `<img
            src="${data.image_url}"
            alt="${data.name}"
            class="item-image"
            onerror="this.onerror=null; this.src='./assets/img/placeholder.svg';"
        />
        <div class="item-info">
            <div class="item-title">${data.name}</div>
            <div class="item-subtitle">Playlist<span class='none'> • You</span></div>
        </div>`;
}

async function loadPlaylist(element, libraryContainer) {
    if (element.name === "Liked Songs") return;
    const playlist = document.createElement("div");
    playlist.dataset.type = "Playlists";
    playlist.className = "library-item";
    playlist.dataset.id = element.id;
    playlist.innerHTML = `<img
            src="${element.image_url}"
            alt="${element.name}"
            class="item-image"
            onerror="this.onerror=null; this.src='./assets/img/placeholder.svg';"
        />
        <div class="item-info">
            <div class="item-title">${element.name}</div>
            <div class="item-subtitle">Playlist<span class='none'> • You</span></div>
        </div>`;
    libraryContainer.appendChild(playlist);
}

async function loadLibraryContent() {
    const libraryContainer = document.querySelector(".library-content");
    libraryContainer.innerHTML = "";

    let totalSongs = 0;
    try {
        totalSongs = await getLikedTracks();
    } catch (error) {
        console.error("Cannot get playlist:", error);
    }

    // Load liked songs
    const likedSongs = document.createElement("div");
    likedSongs.className = "library-item";
    likedSongs.dataset.type = "Liked";
    likedSongs.innerHTML = `
        <div class="item-icon liked-songs">
        <i class="fas fa-heart"></i>
    </div>
    <div class="item-info">
        <div class="item-title">Liked Songs</div>
        <div class="item-subtitle">
            <i class="fas fa-thumbtack"></i>
            Playlist<span class="none"> • ${totalSongs} songs</span>
        </div>
    </div>`;
    libraryContainer.appendChild(likedSongs);

    // Load artists
    const artists = await getArtists(3);
    artists.forEach((element) => {
        const artist = document.createElement("div");
        artist.dataset.type = "Artists";
        artist.className = "library-item";
        artist.dataset.id = element.id;
        artist.innerHTML = `<img
            src="${element.background_image_url}"
            alt="${element.name}"
            class="item-image"
        />
        <div class="item-info">
            <div class="item-title">${element.name}</div>
            <div class="item-subtitle">Artist</div>
        </div>`;
        libraryContainer.appendChild(artist);
    });

    // Load albums
    const albums = await getAlbums(2);
    albums.forEach((element) => {
        const album = document.createElement("div");
        album.dataset.type = "Albums";
        album.className = "library-item";
        album.dataset.id = element.id;
        album.innerHTML = `<img
            src="${element.cover_image_url}"
            alt="${element.title}"
            class="item-image"
        />
        <div class="item-info">
            <div class="item-title">${element.title}</div>
            <div class="item-subtitle">Album<span class='none'> • ${element.artist_name}</span></div>
        </div>`;
        libraryContainer.appendChild(album);
    });

    // Load playlists
    const playlists = await getPlaylists();
    playlists.forEach((element) => {
        loadPlaylist(element, libraryContainer);
    });

    // Make it usable
    enableLibraryFunction();
}

function displayOnViewMode(mode) {
    const libraryContainer = document.querySelector(".library-content");
    function makeCssClasses(name) {
        return name.toLowerCase().trim().replace(/\s+/g, "-");
    }
    mode = `view-${makeCssClasses(mode)}`;

    libraryContainer.classList.remove(
        "view-compact-list",
        "view-default-list",
        "view-compact-grid",
        "view-default-grid",
    );
    libraryContainer.classList.add(mode);
}

async function createPlaylist() {
    try {
        const data = {
            name: "My New Playlist",
            description: "Playlist description",
            is_public: true,
            image_url: "https://example.com/playlist-cover.jpg",
        };
        const response = await httpRequest.post("playlists", data);

        openPlaylist();
        const playlist = response.playlist;
        const header = document.querySelector(".playlist-header");
        const playlistImage = document.querySelector(".playlist-image");
        playlistImage.innerHTML = `<i class="fa-solid fa-music fa-4x"></i>`;
        const playlistInfo = document.querySelector(".playlist-info");
        playlistInfo.innerHTML = `
            <span class="playlist-type">${playlist.is_public ? "Pulic" : "Private"} Playlist
            </span>
            <h1 class="playlist-title">${playlist.name}</h1>
            `;

        const libraryContainer = document.querySelector(".library-content");
        loadPlaylist(playlist, libraryContainer);
    } catch (error) {
        console.error(error);
    }
}

function enableLibraryFunction() {
    const sortBtn = document.querySelector(".sort-btn");
    const sortAndViewPicker = document.querySelector("#sort-and-view-picker");
    const libraryContainer = document.querySelector(".library-content");

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

    // Active state when switch between elements
    {
        let prevElement = null;
        libraryContainer.addEventListener("click", (e) => {
            const element = e.target.closest(".library-item");
            if (!element || element === prevElement) return;
            element.classList.add("active");
            if (prevElement) prevElement.classList.remove("active");
            prevElement = element;
        });
    }

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
        displayOnViewMode(currentMode);
        viewMode.addEventListener("click", (e) => {
            const element = e.target.closest(".view-btn");
            if (!element || element === prevElement) return;

            prevElement.classList.remove("active");
            element.classList.add("active");
            currentMode = element.getAttribute("aria-label");
            iconContainer.innerHTML = element.innerHTML;
            displayOnViewMode(currentMode);
            prevElement = element;
        });
    }
    // Filter Playlists, Artists and Albums
    {
        const navContainer = document.querySelector(".nav-tabs");
        const libraryChilds = Array.from(
            document.querySelector(".library-content").children,
        );
        let prevBtn = null;
        navContainer.addEventListener("click", (e) => {
            const element = e.target.closest(".nav-tab");
            if (!element) return;

            element.classList.toggle("active");
            if (element.classList.contains("active")) {
                libraryChilds.forEach((item) => {
                    if (item.dataset.type === element.innerText)
                        item.classList.remove("hidden");
                    else item.classList.add("hidden");
                });
            } else {
                libraryChilds.forEach((item) => {
                    item.classList.remove("hidden");
                });
            }

            if (prevBtn && prevBtn !== element)
                prevBtn.classList.remove("active");
            prevBtn = element;
        });
    }

    // Context menu in library
    {
        const contextMenu = document.querySelector("#library-context-menu");
        libraryContainer.addEventListener("contextmenu", (e) => {
            const item = e.target.closest(".library-item");
            if (!item) return;

            if (item.dataset.type === "Artists") {
                contextMenu.innerHTML = `<li class="menu-item green-icon">
                <i class="fa-solid fa-xmark"></i>
                <span>Unfollow</span>
                </li>`;
            } else {
                contextMenu.innerHTML = `<li class="menu-item green-check">
                    <i class="fa-solid fa-circle-check"></i>
                    <span>Remove from Your Library</span>
                </li>
                <li class="menu-item">
                    <i class="fa-regular fa-trash-can"></i>
                    <span>Delete</span>
                </li>`;
            }

            contextMenu.classList.add("show");
            contextMenu.style.left = `${e.clientX}px`;
            const rect = contextMenu.getBoundingClientRect();
            if (e.clientY + rect.height > window.innerHeight)
                contextMenu.style.top = `${e.clientY - rect.height}px`;
            else contextMenu.style.top = `${e.clientY}px`;
        });
        document.addEventListener("click", () => {
            contextMenu.classList.remove("show");
        });
    }

    // Enable Detail Page
    {
        const map = {
            Liked: "liked",
            Artists: "artist",
            Playlists: "playlist",
            Albums: "album",
        };
        libraryContainer.addEventListener("click", (e) => {
            const element = e.target.closest(".library-item");
            if (!element) return;
            showDetailInfo(element.dataset.id, map[element.dataset.type]);
        });
    }
    // Create playlist
    {
        const btn = document.querySelector(".create-btn");
        btn.addEventListener("click", createPlaylist);
    }
}

function togglePlaylist(force) {
    const playlist = document.querySelector(".playlist-view");
    playlist.classList.toggle("show", force);
}

function toggleDetailPage(force) {
    const hero = document.querySelector(".artist-hero");
    const controls = document.querySelector(".artist-controls");
    const tracks = document.querySelector(".popular-section");
    hero.classList.toggle("show", force);
    controls.classList.toggle("show", force);
    tracks.classList.toggle("show", force);
}

function toggleMainPage(force) {
    force ^= 1;
    const trendingSongs = document.querySelector(".hits-section");
    const trendingArtists = document.querySelector(".artists-section");
    trendingSongs.classList.toggle("hidden", force);
    trendingArtists.classList.toggle("hidden", force);
}

function openDetailPage() {
    toggleMainPage(0);
    toggleDetailPage(1);
    togglePlaylist(0);
}
function openMainPage() {
    toggleMainPage(1);
    toggleDetailPage(0);
    togglePlaylist(0);
}
function openPlaylist() {
    toggleMainPage(0);
    toggleDetailPage(0);
    togglePlaylist(1);
}

async function showPlaylist(response, isLikedSongs = true) {
    openPlaylist();
    let tracks = null;
    if (isLikedSongs) tracks = response.tracks;
    else
        tracks = (await httpRequest.get(`playlists/${response.id}/tracks`))
            .tracks;
    let isPulic = !isLikedSongs && response.is_public;
    const header = document.querySelector(".playlist-header");
    const playlistContainer = document.querySelector(".playlist-view");
    const playlistImage = document.querySelector(".playlist-image");
    playlistImage.classList.toggle("toggle-editor", isLikedSongs ^ 1);
    playlistImage.classList.toggle("liked-songs", isLikedSongs);
    playlistContainer.classList.toggle("liked-songs-theme", isLikedSongs);
    playlistContainer.dataset.id = response.id;

    let imagePath = `
        <i class="fa-solid fa-music fa-4x"></i>
        <div class="editor-mode">
            <i class="fa-solid fa-pencil"></i>
            <span>Choose photo</span>
        </div>`;
    if (isLikedSongs) imagePath = `<i class="fa-solid fa-heart fa-4x"></i>`;
    playlistImage.innerHTML = imagePath;

    const playlistInfo = document.querySelector(".playlist-info");
    playlistInfo.innerHTML = `
        <span class="playlist-type"
            >${isPulic ? "Pulic" : "Private"} Playlist</span
        >
        <h1 class="playlist-title">${isLikedSongs ? "Liked Songs" : response.name}</h1>
        `;

    const tracksContainer = playlistContainer.querySelector(".track-list");
    tracksContainer.innerHTML = "";
    tracks.forEach((element, idx) => {
        const track = document.createElement("div");
        track.className = "track-item";
        track.innerHTML = `
            <div class="track-number">${idx + 1}</div>
            <div class="track-image">
                <img
                    src="${element.image_url}"
                    alt="${element.title}"
                />
            </div>
            <div class="track-info">
                <div class="track-name">${element.title}</div>
            </div>
            <div class="track-plays">${formatNumberIntl(element.play_count)}</div>
            <div class="track-duration">${formatSeconds(element.duration)}</div>
            <button class="track-menu-btn">
                <i class="fas fa-ellipsis-h"></i>
            </button>`;
        tracksContainer.appendChild(track);
    });
}
async function showArtist(response, id) {
    openDetailPage();
    const hero = document.querySelector(".artist-hero");
    const controls = document.querySelector(".artist-controls");
    const tracks = document.querySelector(".popular-section");
    const isVerifiedContent = response.is_verified
        ? `<div class="verified-badge">
                <i class="fas fa-check-circle"></i>
                <span>Verified Artist</span>
            </div>`
        : "";
    hero.innerHTML = `
        <div class="hero-background">
            <img
                src="${response.background_image_url}"
                alt="${response.name} artist background"
                class="hero-image"
            />
            <div class="hero-overlay"></div>
        </div>
        <div class="hero-content">
            ${isVerifiedContent}
            <h1 class="artist-name">${response.name}</h1>
            <p class="monthly-listeners">
                ${formatNumberIntl(response.monthly_listeners)} monthly listeners
            </p>
        </div>`;
    const tracksContainer = tracks.querySelector(".track-list");
    const popularTracks = (
        await httpRequest.get(`artists/${id}/tracks/popular`)
    ).tracks;
    tracksContainer.innerHTML = "";
    for (const index in popularTracks) {
        const element = popularTracks[index];
        const track = await httpRequest.get(`tracks/${element.id}`);
        const trackContainer = document.createElement("div");
        trackContainer.className = "track-item";
        trackContainer.innerHTML = `
            <div class="track-number">${Number(index) + 1}</div>
            <div class="track-image">
                <img
                    src="${track.image_url}"
                    alt="${track.title}"
                />
            </div>
            <div class="track-info">
                <div class="track-name">
                    ${track.title}
                </div>
            </div>
            <div class="track-plays">${formatNumberIntl(track.play_count)}</div>
            <div class="track-duration">${formatSeconds(track.duration)}</div>
            <button class="track-menu-btn">
                <i class="fas fa-ellipsis-h"></i>
            </button>
        `;

        tracksContainer.appendChild(trackContainer);
    }
}
async function showAlbum(response, id) {
    openDetailPage();
    const hero = document.querySelector(".artist-hero");
    const controls = document.querySelector(".artist-controls");
    const tracks = document.querySelector(".popular-section");
    hero.innerHTML = `
        <div class="hero-background">
            <img
                src="${response.cover_image_url}"
                alt="${response.title} artist background"
                class="hero-image"
            />
            <div class="hero-overlay"></div>
        </div>
        <div class="hero-content">
            <h1 class="artist-name">${response.title}</h1>
        </div>`;

    const tracksContainer = tracks.querySelector(".track-list");
    const albumTracks = (await httpRequest.get(`albums/${id}/tracks`)).tracks;
    tracksContainer.innerHTML = "";
    for (const index in albumTracks) {
        const element = albumTracks[index];
        const track = await httpRequest.get(`tracks/${element.id}`);
        const trackContainer = document.createElement("div");
        trackContainer.className = "track-item";
        trackContainer.innerHTML = `
            <div class="track-number">${Number(index) + 1}</div>
            <div class="track-image">
                <img
                    src="${track.image_url}"
                    alt="${track.title}"
                />
            </div>
            <div class="track-info">
                <div class="track-name">
                    ${track.title}
                </div>
            </div>
            <div class="track-plays">${formatNumberIntl(track.play_count)}</div>
            <div class="track-duration">${formatSeconds(track.duration)}</div>
            <button class="track-menu-btn">
                <i class="fas fa-ellipsis-h"></i>
            </button>
        `;

        tracksContainer.appendChild(trackContainer);
    }
}
async function showDetailInfo(id, type) {
    let response;
    if (type === "artist") {
        response = await httpRequest.get(`artists/${id}`);
        await showArtist(response, id);
    } else if (type === "album") {
        response = await httpRequest.get(`albums/${id}`);
        await showAlbum(response, id);
    } else if (type === "liked") {
        response = await httpRequest.get("me/tracks/liked");
        showPlaylist(response);
    } else if (type === "playlist") {
        response = await httpRequest.get(`playlists/${id}`);
        showPlaylist(response, 0);
    }
}

async function loadMainUI() {
    // Load trending tracks
    {
        const hitsContainer = document.querySelector(".hits-grid");
        const trendingSongs = (
            await httpRequest.get("tracks/trending?limit=10")
        ).tracks;
        hitsContainer.innerHTML = "";
        trendingSongs.forEach((element) => {
            const card = document.createElement("div");
            card.dataset.id = element.id;
            card.className = "hit-card";
            card.innerHTML = `<div class="hit-card-cover">
            <img
                src="${element.image_url}"
                alt="${element.title}"
            />
            <button class="hit-play-btn">
                <i class="fas fa-play"></i>
            </button>
        </div>
        <div class="hit-card-info">
            <h3 class="hit-card-title">${element.title}</h3>
            <p class="hit-card-artist">${element.artist_name}</p>
        </div>`;
            hitsContainer.appendChild(card);
        });
    }
    // Load popular artists
    {
        const artistsContainer = document.querySelector(".artists-grid");
        const trendingArtists = (
            await httpRequest.get("artists/trending?limit=5")
        ).artists;
        artistsContainer.innerHTML = "";
        trendingArtists.forEach((element) => {
            const card = document.createElement("div");
            card.dataset.id = element.id;
            card.className = "artist-card";
            card.innerHTML = `<div class="artist-card-cover">
                <img
                    src="${element.image_url}"
                    alt="${element.name}"
                />
                <button class="artist-play-btn">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="artist-card-info">
                <h3 class="artist-card-name">${element.name}</h3>
                <p class="artist-card-type">Artist</p>
            </div>`;

            artistsContainer.appendChild(card);
        });
        artistsContainer.addEventListener("click", (e) => {
            const element = e.target.closest(".artist-card");
            if (!element) return;
            showDetailInfo(element.dataset.id, "artist");
        });
    }
}

async function editPlaylist() {
    const playlistContainer = document.querySelector(".playlist-view");
    const modalPlaylist = document.querySelector("#modal-playlist");
    const playlistHeader = document.querySelector(".playlist-header");
    const playlistImage = document.querySelector(".playlist-image");
    const image = modalPlaylist.querySelector(".cover-image");
    const title = modalPlaylist.querySelector("#playlist-title");
    const desc = modalPlaylist.querySelector("#playlist-description");
    const imageInput = document.querySelector("#playlist-image-input");
    const saveBtn = document.querySelector(".btn-save");

    let playlist = null;
    playlistHeader.addEventListener("click", async (e) => {
        if (playlistContainer.classList.contains("liked-songs-theme")) return;
        if (
            e.target.closest(".playlist-image") !== playlistImage &&
            e.target.closest(".playlist-title") === null
        )
            return;

        modalPlaylist.classList.add("show");

        const id = playlistContainer.dataset.id;
        playlist = await httpRequest.get(`playlists/${id}`);
        title.value = playlist.name;
        desc.value = playlist.description;
        image.src = playlist.image_url;
        if (e.target.closest(".playlist-image") === playlistImage)
            imageInput.click();
    });

    // User select files
    let file = null;
    imageInput.addEventListener("change", (e) => {
        file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Images only, please!");
            return;
        }

        const imageURL = URL.createObjectURL(file);
        image.src = imageURL;

        image.onload = () => {
            URL.revokeObjectURL(imageURL);
        };
    });

    const origin = "https://spotify.f8team.dev";
    saveBtn.addEventListener("click", async () => {
        // Upload images
        try {
            const id = playlistContainer.dataset.id;
            let url = null;
            if (file) {
                const imageData = new FormData();
                imageData.append("cover", file);
                const imageResponse = await httpRequest.post(
                    `upload/playlist/${id}/cover`,
                    imageData,
                );
                url = `${origin}/${imageResponse.file.url}`;
            }
            const data = {
                ...playlist,
                name: `${title.value}`,
                description: `${desc.value}`,
                ...(url && { image_url: url }),
            };
            const response = await httpRequest.put(`playlists/${id}`, data);
            updatePlaylist(id, response.playlist);
        } catch (error) {
            console.log(error);
            return;
        }

        modalPlaylist.classList.remove("show");
    });
}

// Other functionality
document.addEventListener("DOMContentLoaded", async () => {
    // Disable context menu
    document.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });

    // Enable home reload
    const mainIcon = document.querySelector("#main-icon");
    const homeBtn = document.querySelector(".home-btn");
    const homeFunc = () => {
        openMainPage();
    };
    mainIcon.addEventListener("click", homeFunc);
    homeBtn.addEventListener("click", homeFunc);

    // Enable editor for image
    {
        const playlistImage = document.querySelector(".playlist-image");
        playlistImage.addEventListener("mouseover", () => {
            const editor = playlistImage.querySelector(".editor-mode");
            if (editor) editor.classList.add("show");
        });
        playlistImage.addEventListener("mouseleave", () => {
            const editor = playlistImage.querySelector(".editor-mode");
            if (editor) editor.classList.remove("show");
        });
    }

    // Playlist modal function
    const modalPlaylist = document.querySelector("#modal-playlist");
    modalPlaylist.addEventListener("click", (e) => {
        if (e.target !== modalPlaylist) return;
        modalPlaylist.classList.remove("show");
    });
    const btnClose = modalPlaylist.querySelector(".btn-close");
    btnClose.addEventListener("click", () => {
        modalPlaylist.classList.remove("show");
    });
    document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        modalPlaylist.classList.remove("show");
    });

    // Edit Playlist
    editPlaylist();

    showUserDetails();
    enableToolTip();
    loadLibraryContent();
    loadMainUI();
});
