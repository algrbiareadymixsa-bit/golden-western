/* ============================================
   Golden Western - Main JavaScript
   ============================================ */

// Google Sheets Integration
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwsygdXY2S0mt0_ydAgeL9CngqddHkZarUTK76rEoDB6YBnObJC96EkwfMZUV2rTnUb/exec';

// Submit form data to Google Sheets
async function submitToGoogleSheets(formData) {
    try {
        const formBody = new URLSearchParams();
        for (const key in formData) {
            if (formData[key] !== undefined && formData[key] !== null) {
                formBody.append(key, formData[key]);
            }
        }
        
        const response = await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody.toString()
        });
        
        try {
            const responseText = await response.text();
            console.log('Google Sheets response:', responseText);
            return { success: true, message: 'Data submitted successfully' };
        } catch (e) {
            return { success: true, message: 'Request sent (CORS prevented response reading)' };
        }
    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
        console.log('Form data that would be sent:', formData);
        
        return { 
            success: false, 
            error: error.message,
            fallbackData: formData
        };
    }
}

// Save form data to localStorage as backup
function saveToLocalStorage(formData) {
    try {
        const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
        
        submissions.push({
            ...formData,
            savedAt: new Date().toISOString()
        });
        
        const recentSubmissions = submissions.slice(-50);
        localStorage.setItem('formSubmissions', JSON.stringify(recentSubmissions));
        
        console.log('Saved to localStorage. Total submissions:', recentSubmissions.length);
        
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// Email notification (placeholder)
function sendEmailNotification(formData) {
    console.log('Email notification would be sent for:', formData);
}

// ============================================
// Theme & Language Functions
// ============================================

function toggleTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        document.querySelectorAll('.theme-btn[data-theme="light"]').forEach(btn => btn.classList.add('active'));
        document.querySelectorAll('.theme-btn[data-theme="dark"]').forEach(btn => btn.classList.remove('active'));
    } else {
        document.body.classList.remove('light-mode');
        document.querySelectorAll('.theme-btn[data-theme="dark"]').forEach(btn => btn.classList.add('active'));
        document.querySelectorAll('.theme-btn[data-theme="light"]').forEach(btn => btn.classList.remove('active'));
    }
    localStorage.setItem('theme', theme);
}

function setLanguage(lang) {
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Store preference
    localStorage.setItem('language', lang);
    
    // Here you would implement full language switching
    // For now, we just update the buttons
    console.log('Language set to:', lang);
}

// ============================================
// Mobile Menu Functions
// ============================================

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    if (mobileMenu && menuOverlay) {
        mobileMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    if (mobileMenu && menuOverlay) {
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
    }
}

// ============================================
// Navigation Functions
// ============================================

function handleNavigationScroll() {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    
    if (window.scrollY > 50) {
        if (navbar) navbar.classList.add('scrolled');
        if (backToTop) backToTop.classList.add('show');
    } else {
        if (navbar) navbar.classList.remove('scrolled');
        if (backToTop) backToTop.classList.remove('show');
    }

    // Update active navigation link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') && link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
}

// ============================================
// Contact Form Handler
// ============================================

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = {
        name: form.querySelector('input[name="name"]')?.value?.trim() || '',
        phone: form.querySelector('input[name="phone"]')?.value?.trim() || '',
        email: form.querySelector('input[name="email"]')?.value?.trim() || '',
        concrete_type: form.querySelector('select[name="concrete_type"]')?.value || '',
        quantity: form.querySelector('input[name="quantity"]')?.value?.trim() || '',
        message: form.querySelector('textarea[name="message"]')?.value?.trim() || '',
        timestamp: new Date().toLocaleString('en-US', { 
            timeZone: 'Asia/Riyadh',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }),
        language: document.querySelector('.lang-btn.active')?.dataset.lang || 'ar',
        source: 'golden-western-website'
    };
    
    if (!formData.name || !formData.phone) {
        alert('الرجاء إدخال الاسم ورقم الهاتف');
        return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    submitBtn.disabled = true;
    
    submitToGoogleSheets(formData).then(result => {
        if (result.success) {
            alert('شكراً لتواصلكم معنا! تم استلام طلبكم بنجاح.');
            form.reset();
            sendEmailNotification(formData);
        } else {
            saveToLocalStorage(formData);
            alert('شكراً لتواصلكم معنا! تم حفظ طلبكم.');
            form.reset();
        }
    }).catch(error => {
        console.error('Form submission error:', error);
        saveToLocalStorage(formData);
        alert('شكراً لتواصلكم معنا! تم استلام طلبكم.');
        form.reset();
    }).finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// ============================================
// Video Fallback
// ============================================

function setupVideoFallback() {
    const video = document.getElementById('heroVideo');
    const fallback = document.querySelector('.video-fallback');
    
    if (video) {
        // Handle video error
        video.addEventListener('error', function() {
            console.log('Video failed to load, showing fallback');
            if (fallback) {
                fallback.style.display = 'block';
                fallback.classList.add('error');
            }
        });
        
        // Also check if video can't play
        video.addEventListener('stalled', function() {
            if (fallback) {
                fallback.style.display = 'block';
            }
        });
        
        // If video is not supported, show fallback
        if (!video.canPlayType('video/mp4')) {
            if (fallback) {
                fallback.style.display = 'block';
            }
        }
    }
}

// ============================================
// Three.js Background
// ============================================

function initThreeBackground() {
    const container = document.getElementById('three-container');
    if (!container || typeof THREE === 'undefined') return;
    
    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        
        // Create particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 500;
        const posArray = new Float32Array(particlesCount * 3);
        
        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: 0xFFD700,
            transparent: true,
            opacity: 0.8
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        
        camera.position.z = 3;
        
        // Animation
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (event) => {
            mouseX = event.clientX / window.innerWidth - 0.5;
            mouseY = event.clientY / window.innerHeight - 0.5;
        });
        
        function animate() {
            requestAnimationFrame(animate);
            
            particlesMesh.rotation.y += 0.0005;
            particlesMesh.rotation.x += 0.0005;
            
            // Gentle mouse movement
            particlesMesh.rotation.y += mouseX * 0.05;
            particlesMesh.rotation.x += mouseY * 0.05;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
    } catch (error) {
        console.log('Three.js initialization failed:', error);
    }
}

// ============================================
// Initialize Event Listeners
// ============================================

function initializeEventListeners() {
    // Theme switcher
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            toggleTheme(theme);
        });
    });
    
    // Language switcher
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            setLanguage(lang);
        });
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMobileMenu);
    
    // Mobile nav links - close menu on click
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Scroll events
    window.addEventListener('scroll', handleNavigationScroll);
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Back to top
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Set current year
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    toggleTheme(savedTheme);
}

// ============================================
// DOM Ready
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    setupVideoFallback();
    handleNavigationScroll();
    
    // Initialize Three.js background
    if (typeof THREE !== 'undefined') {
        initThreeBackground();
    } else {
        // Load Three.js from CDN if not already loaded
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js';
        script.onload = initThreeBackground;
        document.head.appendChild(script);
    }
});

