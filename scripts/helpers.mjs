
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
export function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

// function to save data inot local storage 
export function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}