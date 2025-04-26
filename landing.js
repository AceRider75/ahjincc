// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const parallaxBg = document.getElementById('parallax-bg');
const header = document.querySelector('header');
const loginBtn = document.getElementById('login-btn');
const mobileLoginBtn = document.getElementById('mobile-login-btn');
const registerBtn = document.getElementById('register-btn');
const authModal = document.getElementById('authModal');
const modalClose = document.querySelector('.modal-close');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu-close');

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

// Parallax Effect
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    parallaxBg.style.transform = `translate(${mouseX * -30}px, ${mouseY * -30}px)`;
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }
        }
    });
});

// Header Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Modal Functionality
function openModal() {
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    authModal.classList.remove('active');
    document.body.style.overflow = '';
}

loginBtn.addEventListener('click', openModal);
if (mobileLoginBtn) mobileLoginBtn.addEventListener('click', openModal);
if (registerBtn) registerBtn.addEventListener('click', () => {
    openModal();
    // Switch to register tab
    authTabs.forEach(tab => tab.classList.remove('active'));
    authForms.forEach(form => form.classList.remove('active'));
    document.querySelector('[data-tab="register"]').classList.add('active');
    document.getElementById('registerForm').classList.add('active');
});

modalClose.addEventListener('click', closeModal);
authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
        closeModal();
    }
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
        document.getElementById(`${tabTarget}Form`).classList.add('active');
    });
});

// Mobile Menu
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
});

mobileMenuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
});

// Form Submissions
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Add login logic here
    alert('Login functionality would be implemented here');
    closeModal();
});

document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Add registration logic here
    alert('Registration functionality would be implemented here');
    closeModal();
});

document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Add contact form submission logic here
    alert('Your message has been sent successfully!');
    e.target.reset();
});

// Animations on Scroll
const animateElements = document.querySelectorAll('[data-aos]');

function checkScroll() {
    const triggerBottom = window.innerHeight * 0.8;
    
    animateElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < triggerBottom) {
            element.classList.add('aos-animate');
        } else {
            element.classList.remove('aos-animate');
        }
    });
}

window.addEventListener('scroll', checkScroll);
window.addEventListener('resize', checkScroll);
window.addEventListener('load', () => {
    // Initial check for elements in view
    checkScroll();
    
    // Fade in the page
    document.body.classList.add('loaded');
});

// Initialize animations with delays
animateElements.forEach((element, index) => {
    const delay = element.getAttribute('data-aos-delay') || (index % 3) * 100;
    element.style.transitionDelay = `${delay}ms`;
});
