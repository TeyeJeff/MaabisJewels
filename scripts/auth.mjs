

import { getCurrentUser, loginUser, registerUser, logoutUser } from "./helpers.mjs";


export function updateAuthUI() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const profileInfo = document.getElementById('profile-info');
    const usernameDisplay = document.getElementById('username-display');
    const lastLoginDisplay = document.getElementById('last-login');

    const user = getCurrentUser();
    if (user) {
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        profileInfo.style.display = 'block';
        usernameDisplay.textContent = user.username;
        lastLoginDisplay.textContent = new Date(user.lastLogin).toLocaleString();
    } else {
        loginForm.style.display = 'block';
        profileInfo.style.display = 'none';
        registerForm.style.display = 'none';
    }
}

// Function to update the profile button text in header (also exported)
export function updateHeaderGreeting() {
    const user = getCurrentUser();
    const profileBtn = document.querySelector('.profile-btn');
    if (profileBtn) {
        profileBtn.textContent = user ? `Hi, ${user.username}` : '👤 Profile';
    }
}

// Toggle between login/register forms
function toggleRegister() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    if (loginForm && registerForm) {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

function toggleLogin() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    if (loginForm && registerForm) {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    }
}

// Initialize auth UI and attach listeners (runs only on pages that load auth.mjs)
document.addEventListener('DOMContentLoaded', () => {
    // Attach toggle links
    document.getElementById('show-register')?.addEventListener('click', (e) => {
        e.preventDefault();  // stop the link from defaulting connecting to another page
        toggleRegister();
    });

    document.getElementById('show-login')?.addEventListener('click', (e) => {
        e.preventDefault();   // stop the link from defaulting connecting to another page
        toggleLogin();
    });

    // Login button
    document.getElementById('login-btn')?.addEventListener('click', () => {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        const user = loginUser(username, password);
        if (user) {
            updateAuthUI();
            updateHeaderGreeting();
            alert('Logged in successfully!');
        } else {
            alert('Invalid username or password');
        }
    });

    // Register button
    document.getElementById('register-btn')?.addEventListener('click', () => {
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value;
        const user = registerUser(username, password);
        if (user) {
            updateAuthUI();
            updateHeaderGreeting();
            alert('Account created! You are now logged in.');
        } else {
            alert('Username already taken or invalid input');
        }
    });

    // Logout button
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        logoutUser();
        updateAuthUI();
        updateHeaderGreeting();
        alert('Logged out successfully');
    });

    // Initial UI update on page load
    updateAuthUI();
    updateHeaderGreeting();
});