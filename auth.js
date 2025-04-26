// Firebase Configuration
const firebaseConfig = {
    apiKey: "",
    authDomain: "ahjincc.firebaseapp.com",
    databaseURL: "https://ahjincc-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ahjincc",
    storageBucket: "ahjincc.firebasestorage.app",
    messagingSenderId: "287401404736",
    appId: "1:287401404736:web:88fbe3b9bf4c4c20ae32a5",
    measurementId: "G-FLKN369J4M"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const googleLoginBtn = document.getElementById('googleLogin');
const googleRegisterBtn = document.getElementById('googleRegister');
const githubLoginBtn = document.getElementById('githubLogin');
const githubRegisterBtn = document.getElementById('githubRegister');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');
const successModal = document.getElementById('successModal');
const successMessage = document.getElementById('successMessage');
const successDoneBtn = document.getElementById('successDoneBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const registerPassword = document.getElementById('registerPassword');
const strengthSegments = document.querySelectorAll('.strength-segment');
const strengthText = document.querySelector('.strength-text');

// Theme Toggle
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Check for saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

// Auth Tabs
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabTarget = tab.getAttribute('data-tab');
        
        // Update active tab
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show corresponding form
        authForms.forEach(form => form.classList.remove('active'));
        if (tabTarget === 'login') {
            loginForm.classList.add('active');
        } else {
            registerForm.classList.add('active');
        }
    });
});

// Toggle Password Visibility
togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        const icon = btn.querySelector('.material-icons');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.textContent = 'visibility';
        } else {
            input.type = 'password';
            icon.textContent = 'visibility_off';
        }
    });
});

// Password Strength Meter
registerPassword.addEventListener('input', () => {
    const password = registerPassword.value;
    const strength = checkPasswordStrength(password);
    
    // Reset all segments
    strengthSegments.forEach(segment => {
        segment.className = 'strength-segment';
    });
    
    if (password.length === 0) {
        strengthText.textContent = 'Password strength';
        return;
    }
    
    if (strength === 'weak') {
        strengthSegments[0].classList.add('weak');
        strengthText.textContent = 'Weak';
    } else if (strength === 'medium') {
        strengthSegments[0].classList.add('medium');
        strengthSegments[1].classList.add('medium');
        strengthText.textContent = 'Medium';
    } else if (strength === 'strong') {
        strengthSegments[0].classList.add('strong');
        strengthSegments[1].classList.add('strong');
        strengthSegments[2].classList.add('strong');
        strengthText.textContent = 'Strong';
    } else if (strength === 'very-strong') {
        strengthSegments.forEach(segment => {
            segment.classList.add('strong');
        });
        strengthText.textContent = 'Very Strong';
    }
});

function checkPasswordStrength(password) {
    const length = password.length;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const criteria = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChars].filter(Boolean).length;
    
    if (length < 6) {
        return 'weak';
    } else if (length < 8 || criteria < 2) {
        return 'medium';
    } else if (length < 10 || criteria < 3) {
        return 'strong';
    } else {
        return 'very-strong';
    }
}

// Show Loading
function showLoading() {
    loadingOverlay.classList.add('active');
}

// Hide Loading
function hideLoading() {
    loadingOverlay.classList.remove('active');
}

// Show Success Modal
function showSuccessModal(message) {
    successMessage.textContent = message;
    successModal.classList.add('active');
}

// Email/Password Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        showLoading();
        await auth.signInWithEmailAndPassword(email, password);
        hideLoading();
        showSuccessModal('You have successfully logged in!');
    } catch (error) {
        hideLoading();
        alert(`Login failed: ${error.message}`);
    }
});

// Email/Password Registration
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    try {
        showLoading();
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Update profile with name
        await userCredential.user.updateProfile({
            displayName: name
        });
        
        hideLoading();
        showSuccessModal('Your account has been created successfully!');
    } catch (error) {
        hideLoading();
        alert(`Registration failed: ${error.message}`);
    }
});

// Google Authentication
async function signInWithGoogle() {
    try {
        showLoading();
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
        hideLoading();
        showSuccessModal('You have successfully logged in with Google!');
    } catch (error) {
        hideLoading();
        alert(`Google sign-in failed: ${error.message}`);
    }
}

googleLoginBtn.addEventListener('click', signInWithGoogle);
googleRegisterBtn.addEventListener('click', signInWithGoogle);

// GitHub Authentication
async function signInWithGithub() {
    try {
        showLoading();
        const provider = new firebase.auth.GithubAuthProvider();
        await auth.signInWithPopup(provider);
        hideLoading();
        showSuccessModal('You have successfully logged in with GitHub!');
    } catch (error) {
        hideLoading();
        alert(`GitHub sign-in failed: ${error.message}`);
    }
}

githubLoginBtn.addEventListener('click', signInWithGithub);
githubRegisterBtn.addEventListener('click', signInWithGithub);

// Success Done Button
successDoneBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Close Success Modal when clicking outside
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('active');
    }
});

// Update landing.js to redirect to auth.html
// This is a note for you to update your landing.js file with the following code:
/*
// In your landing.js file, update the login and register button event listeners:
loginBtn.addEventListener('click', () => {
    window.location.href = 'auth.html?tab=login';
});

registerBtn.addEventListener('click', () => {
    window.location.href = 'auth.html?tab=register';
});
*/

// Check URL parameters to set active tab
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    
    if (tab === 'register') {
        authTabs.forEach(t => t.classList.remove('active'));
        document.querySelector('[data-tab="register"]').classList.add('active');
        
        authForms.forEach(form => form.classList.remove('active'));
        registerForm.classList.add('active');
    }
});
