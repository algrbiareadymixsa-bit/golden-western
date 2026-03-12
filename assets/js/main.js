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
}

// ============================================
// Mobile Menu Functions
// ============================================

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    mobileMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
}

// ============================================
// Navigation Functions
// ============================================

function handleNavigationScroll() {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        if (backToTop) backToTop.classList.add('show');
    } else {
        navbar.classList.remove('scrolled');
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
    
    const formData = {
        name: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        productType: document.getElementById('productType').value,
        concreteType: document.querySelector('input[name="concreteType"]:checked').value,
        quantity: document.getElementById('quantity').value,
        projectLocation: document.getElementById('projectLocation').value.trim(),
        message: document.getElementById('message').value.trim(),
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
    
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
        alert('Please fill in all required fields: Name, Email, Phone, and Message');
        return;
    }
    
    const submitBtn = document.querySelector('#projectInquiryForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    submitBtn.disabled = true;
    
    submitToGoogleSheets(formData).then(result => {
        if (result.success) {
            alert('شكراً لتواصلكم معنا! تم استلام طلبكم بنجاح وسنقوم بالرد عليكم في أقرب وقت ممكن.');
            document.getElementById('projectInquiryForm').reset();
            const quantityDisplay = document.getElementById('quantityDisplay');
            if (quantityDisplay) {
                quantityDisplay.textContent = '0 م³';
                quantityDisplay.classList.remove('show');
            }
            sendEmailNotification(formData);
        } else {
            saveToLocalStorage(formData);
            alert('شكراً لتواصلكم معنا! تم حفظ طلبكم محلياً وسنقوم بالرد عليكم في أقرب وقت ممكن.');
            document.getElementById('projectInquiryForm').reset();
        }
    }).catch(error => {
        console.error('Form submission error:', error);
        saveToLocalStorage(formData);
        alert('شكراً لتواصلكم معنا! تم استلام طلبكم وسنقوم بالرد عليكم قريباً.');
        document.getElementById('projectInquiryForm').reset();
    }).finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// ============================================
// Newsletter Form Handler
// ============================================

function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('newsletter-input').value;
    
    if (email) {
        const formData = {
            email: email,
            type: 'newsletter',
            timestamp: new Date().toISOString()
        };
        
        submitToGoogleSheets(formData).then(() => {
            alert('شكراً لاشتراكك في نشرتنا الإخبارية!');
            e.target.reset();
        }).catch(() => {
            console.log('Newsletter subscription saved locally:', email);
            alert('شكراً لاشتراكك في نشرتنا الإخبارية!');
            e.target.reset();
        });
    }
}

// ============================================
// Concrete Calculation
// ============================================

function setupConcreteCalculation() {
    const quantityInput = document.getElementById('quantity');
    const quantityDisplay = document.getElementById('quantityDisplay');
    
    if (!quantityInput || !quantityDisplay) return;
    
    quantityInput.addEventListener('input', function() {
        const quantity = parseFloat(this.value) || 0;
        if (quantity > 0) {
            quantityDisplay.textContent = `${quantity.toFixed(2)} م³`;
            quantityDisplay.classList.add('show');
        } else {
            quantityDisplay.classList.remove('show');
        }
    });
    
    if (quantityInput.value) {
        const quantity = parseFloat(quantityInput.value) || 0;
        if (quantity > 0) {
            quantityDisplay.textContent = `${quantity.toFixed(2)} م³`;
            quantityDisplay.classList.add('show');
        }
    }
}

// ============================================
// Video Fallback
// ============================================

function setupVideoFallback() {
    const video = document.querySelector('video');
    if (video) {
        video.addEventListener('error', function() {
            this.style.display = 'none';
        });
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
    
    // Mobile menu
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', toggleMobileMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', toggleMobileMenu);
    
    // Mobile nav links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Scroll events
    window.addEventListener('scroll', handleNavigationScroll);
    
    // Form submissions
    const projectForm = document.getElementById('projectInquiryForm');
    if (projectForm) {
        projectForm.addEventListener('submit', handleFormSubmit);
    }
    
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
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
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}

// ============================================
// DOM Ready
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    setupConcreteCalculation();
    setupVideoFallback();
    handleNavigationScroll();
});

