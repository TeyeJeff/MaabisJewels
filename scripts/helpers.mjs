
export async function loadTemplate(path) {
    try {
        const res = await fetch(path);
        if (!res.ok) {
            throw new Error(`Failed to load template: ${res.status} ${path}`);
        }
        return await res.text();
    } catch (err) {
        console.error("Template load error:", err);
        return "<p style='color:red'>Error loading header/footer</p>"; // fallback
    }
}

export function injectTemplate(template, parentElement, data, callback) {
    if (!parentElement) return;
    parentElement.innerHTML = template;

    if (callback) {
        callback(data);
    }
}

// One-time setup flag (prevents duplicate listeners) 
let headerListenersAdded = false;

export async function loadHeaderFooter() {
    const headerTemplate = await loadTemplate("/includes/header.html"); 
    const footerTemplate = await loadTemplate("/includes/footer.html");

    const headerElement = document.querySelector("#main-header");
    const footerElement = document.querySelector("#main-footer");

    if (headerElement) injectTemplate(headerTemplate, headerElement);
    if (footerElement) injectTemplate(footerTemplate, footerElement);

    // Only add listeners once (important!)
    if (!headerListenersAdded) {
        addHeaderEventListeners();
        headerListenersAdded = true;
    }
}

function addHeaderEventListeners() {
    // Hamburger menu
    const hamburger = document.querySelector(".hamburger");
    const nav = document.querySelector("#main-nav");
    const body = document.body;

    if (hamburger && nav) {
        hamburger.addEventListener("click", () => {
            const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
            hamburger.setAttribute("aria-expanded", !isExpanded);
            nav.classList.toggle("active");
            body.classList.toggle("menu-open");
        });

        // Close menu on link click
        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                hamburger.setAttribute("aria-expanded", "false");
                nav.classList.remove("active");
                body.classList.remove("menu-open");
            });
        });
    }

    // Profile dropdown toggle
    const profileBtn = document.querySelector(".profile-btn");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    if (profileBtn && dropdownMenu) {
        profileBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // stops the click-event from bubbling up to the document
            const isOpen = dropdownMenu.classList.contains("active");
            dropdownMenu.classList.toggle("active");
            profileBtn.setAttribute("aria-expanded", !isOpen);
        });

        // Close on outside click
        document.addEventListener("click", (e) => {
            if (!profileBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove("active");
                profileBtn.setAttribute("aria-expanded", "false");
            }
        });
    }
}

// function to retrieve data to local storage
/**
 * Safely retrieves a value from localStorage and parses it as JSON.
 * @param {string} key - This is the key to retrieve from local storage
 * @param {*} defaultValue - Value to return if key doesn't exist or parsing fails
 * @returns {*} Parsed value or defaultValue
 */
export function getLocalStorage(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        // If no value exists, return default immediately instead of crashing
        if (value == null) return defaultValue;
        return JSON.parse(value);
    } catch (error) {
        console.error(`Error reading localStorage key "${key}": `, error);
        return defaultValue;
    }
}

// function to save data inot local storage
/**
 * Safely saves a value to localStorage as JSON.
 * @param {string} key - The key to set
 * @param {*} data - The value to store (will be JSON.stringified)
 */
export function setLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error writing to localStorage Key"${key}":`, error);
    }
}

// function to remove data from localStorage
/**
 * Removes a key from localStorage
 * @param {string} key - The key to remove
 */

export function removeLocalStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing localStorage key"${key}":`, error);
    }
}

// function to check if user is logged in 
export function isLoggedIn() {
    return !!getLocalStorage("currentUser");
}

// function to get current user object
export function getCurrentUser() {
    return getLocalStorage("currentUser", null);
}

/*Simple login simulation which uses localStorage and accepts any non-empty username + password 
will be able to validate against stored users after learning backend dev in the next few blocks*/

export function loginUser(username, password) {
    if (!username || !password) return null;  // when the username and password fields are empty, a null is return this prevents saving empty/invalid logins

    const user = { username, lastLogin: new Date().toISOString() }; // this creates a simple user object with two properties, this object represents the logged-in user
    setLocalStorage("currentUser", user); // saves the user object as json under the key "currentUser"
    return user;
}


// Function to save or register just the username
export function registerUser(username, password) {
    if (!username || !password) return null 

    // check if username already exists
    const existing = getLocalStorage("users", {});

    if (existing[username]) return null;

    existing[username] = { password: "hashed in-real-app", created: new Date() };
    setLocalStorage("users", existing);

    return loginUser(username, password);

    }

// function to logout 
export function logoutUser() {
    removeLocalStorage("currentUser");
}