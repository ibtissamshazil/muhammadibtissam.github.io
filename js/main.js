// ============================================
// PORTFOLIO WEBSITE - MAIN JAVASCRIPT
// ============================================

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const tabContents = document.querySelectorAll('.tab-content');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.querySelector('.nav-menu');
const ctaButtons = document.querySelectorAll('.cta-button:not(.nav-cta)');
const navCta = document.getElementById('navCta');
const contactModal = document.getElementById('contactModal');
const modalClose = document.getElementById('modalClose');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

// Helper: Check if we're on mobile view
function isMobileView() {
    if (!mobileMenuToggle) return false;
    return window.getComputedStyle(mobileMenuToggle).display !== 'none';
}

// ============================================
// TAB NAVIGATION
// ============================================

function switchTab(tabName) {
    // Update active nav link
    navLinks.forEach(link => {
        if (link.dataset.tab === tabName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Update active tab content
    tabContents.forEach(content => {
        if (content.id === tabName) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });

    // Close mobile menu if open (only on mobile)
    if (isMobileView() && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove('active');
        }
        document.body.style.overflow = '';
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle nav link clicks
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = link.dataset.tab;
        switchTab(tabName);
        
        // Update URL hash without scrolling
        history.pushState(null, null, `#${tabName}`);
    });
});

// Handle hash changes (browser back/forward)
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (hash && ['home', 'experience', 'case-studies', 'contact'].includes(hash)) {
        switchTab(hash);
    }
});

// Initialize tab from URL hash
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.slice(1);
    if (hash && ['home', 'experience', 'case-studies', 'contact'].includes(hash)) {
        switchTab(hash);
    } else {
        switchTab('home');
    }
    
    // Ensure body scroll is enabled on page load
    document.body.style.overflow = '';
    
    // Start hero role typewriter animation
    initHeroRoleAnimation();
});

// ============================================
// HERO ROLE TYPEWRITER ANIMATION
// ============================================

function initHeroRoleAnimation() {
    const roles = [
        'AI Product Manager',
        'Product Engineer',
        'Data Analyst'
    ];
    const textEl = document.getElementById('heroRoleText');
    if (!textEl) return;

    const typeSpeed = 50;
    const deleteSpeed = 50;
    const pauseAfterType = 1500;
    const pauseAfterDelete = 300;

    let roleIndex = 0;
    let isDeleting = false;
    let currentText = '';

    function tick() {
        const role = roles[roleIndex];

        if (isDeleting) {
            currentText = role.substring(0, currentText.length - 1);
            textEl.textContent = currentText;
            if (currentText.length === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(tick, pauseAfterDelete);
                return;
            }
            setTimeout(tick, deleteSpeed);
            return;
        }

        currentText = role.substring(0, currentText.length + 1);
        textEl.textContent = currentText;
        if (currentText.length === role.length) {
            isDeleting = true;
            setTimeout(tick, pauseAfterType);
            return;
        }
        setTimeout(tick, typeSpeed);
    }

    // Start after a short delay
    setTimeout(tick, 400);
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Only handle on mobile view
        if (!isMobileView()) return;
        
        const isActive = navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open (only on mobile)
        if (isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
}

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (isMobileView() && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
    });
});

// Close mobile menu when clicking outside (only on mobile)
document.addEventListener('click', (e) => {
    if (!isMobileView() || !navMenu.classList.contains('active')) return;
    
    if (navMenu && mobileMenuToggle) {
        const isClickInsideMenu = navMenu.contains(e.target);
        const isClickOnToggle = mobileMenuToggle.contains(e.target);
        
        if (!isClickInsideMenu && !isClickOnToggle) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// ============================================
// MODAL FUNCTIONALITY
// ============================================

function openModal() {
    if (contactModal) {
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (contactModal) {
        contactModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Open modal on CTA button clicks (excluding nav-cta and form submit)
ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        if (button.type !== 'submit' && button.id !== 'modalClose') {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        }
    });
});

// Handle nav CTA button separately
if (navCta) {
    navCta.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal();
    });
}

// Close modal
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

// Close modal on overlay click
contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal.classList.contains('active')) {
        closeModal();
    }
});

// ============================================
// CONTACT FORM HANDLING
// ============================================

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }

        formSuccess.style.display = 'block';
        contactForm.style.display = 'none';

        setTimeout(() => {
            contactForm.reset();
            contactForm.style.display = 'flex';
            formSuccess.style.display = 'none';
        }, 5000);

        console.log('Form submitted:', { name, email, message });
    });
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const scrollRevealElements = document.querySelectorAll('.experience-card, .experience-item, .case-study, .contact-card');
    scrollRevealElements.forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
});

// ============================================
// LAZY LOADING IMAGES
// ============================================

function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.style.cssText = 'background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; color: var(--text-muted); min-height: 200px;';
            placeholder.textContent = 'Image not available';
            this.parentNode.insertBefore(placeholder, this);
        });
        
        imageObserver.observe(img);
    });
}

document.addEventListener('DOMContentLoaded', lazyLoadImages);

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

console.log('%c👋 Hello! Interested in my work?', 'font-size: 16px; font-weight: bold; color: #6366f1;');
console.log('%cLet\'s connect: ibtissamshazil@gmail.com', 'font-size: 12px; color: #a3a3a3;');
