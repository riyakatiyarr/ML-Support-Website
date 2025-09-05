// ML Support Healthcare Website - Fixed JavaScript Application
// Ensuring all functionality works properly

class MLSupportApp {
    constructor() {
        this.currentSection = 'home';
        this.currentTestimonial = 1;
        this.totalTestimonials = 3;
        this.isAnimating = false;
        this.countersAnimated = false;
        this.testimonialInterval = null;
        
        // Bind methods to ensure proper context
        this.handleScroll = this.handleScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleHashChange = this.handleHashChange.bind(this);
        
        this.init();
    }

    init() {
        // Ensure DOM is ready before setting up
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupAll();
            });
        } else {
            this.setupAll();
        }
    }

    setupAll() {
        try {
            this.setupEventListeners();
            this.setupNavigation();
            this.setupMobileMenu();
            this.setupScrollEffects();
            this.setupForms();
            this.setupHospitalFilters();
            this.setupModals();
            this.handleInitialLoad();
            this.startTestimonialAutoplay();
            this.observeElements();
            
            console.log('ML Support App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    setupEventListeners() {
        // Window events with error handling
        window.addEventListener('scroll', this.throttle(this.handleScroll, 16));
        window.addEventListener('resize', this.throttle(this.handleResize, 100));
        window.addEventListener('hashchange', this.handleHashChange);
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        console.log('Setting up navigation for', navLinks.length, 'links');
        
        navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const targetSection = href.substring(1);
                    console.log('Navigating to section:', targetSection);
                    this.navigateToSection(targetSection);
                    this.closeMobileMenu();
                }
            });
            
            console.log(`Nav link ${index + 1} set up:`, link.getAttribute('href'));
        });

        // Setup footer links
        const footerLinks = document.querySelectorAll('.footer-section a[href^="#"]');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('href').substring(1);
                this.navigateToSection(targetSection);
            });
        });

        // Setup hero buttons
        const heroButtons = document.querySelectorAll('.hero-actions .btn');
        heroButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const onclick = btn.getAttribute('onclick');
                if (onclick && onclick.includes('scrollToSection')) {
                    const section = onclick.match(/'([^']+)'/);
                    if (section) {
                        this.navigateToSection(section[1]);
                    }
                }
            });
        });
    }

    setupMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            console.log('Setting up mobile menu');
            
            navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Mobile menu toggle clicked');
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu();
                }
            });
        }
    }

    closeMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }

    setupScrollEffects() {
        const navbar = document.getElementById('navbar');
        
        const updateNavbar = () => {
            if (window.scrollY > 50) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }
        };

        updateNavbar();
        window.addEventListener('scroll', updateNavbar);
    }

    setupModals() {
        console.log('Setting up modals');
        
        // Setup login button in navbar
        const loginBtn = document.querySelector('.nav-menu .btn--primary');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Login button clicked');
                this.openLoginModal();
            });
        }

        // Setup modal overlay click to close
        const modalOverlay = document.querySelector('.modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                this.closeLoginModal();
            });
        }

        // Setup modal close button
        const modalClose = document.querySelector('.modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeLoginModal();
            });
        }

        // Setup tab buttons
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const isLogin = btn.textContent.trim() === 'Login';
                this.showLoginTab(isLogin ? 'login' : 'register');
            });
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeLoginModal();
            }
        });
    }

    navigateToSection(sectionId) {
        if (this.isAnimating) {
            console.log('Navigation blocked - animation in progress');
            return;
        }
        
        console.log('Navigating to section:', sectionId);
        this.isAnimating = true;
        
        // Hide current section
        const currentSectionEl = document.querySelector('.section.active');
        if (currentSectionEl) {
            currentSectionEl.classList.remove('active');
            console.log('Hidden section:', currentSectionEl.id);
        }
        
        // Show target section
        const targetSectionEl = document.getElementById(sectionId);
        if (targetSectionEl) {
            targetSectionEl.classList.add('active');
            targetSectionEl.classList.add('fade-in-up');
            console.log('Showing section:', sectionId);
            
            // Update URL hash
            history.replaceState(null, null, `#${sectionId}`);
            
            // Update navigation active state
            this.updateActiveNav(sectionId);
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Reset and trigger animations
            this.countersAnimated = false;
            this.handleSectionSpecificAnimations(sectionId);
        } else {
            console.error('Target section not found:', sectionId);
        }
        
        this.currentSection = sectionId;
        
        setTimeout(() => {
            this.isAnimating = false;
            if (targetSectionEl) {
                targetSectionEl.classList.remove('fade-in-up');
            }
        }, 800);
    }

    handleSectionSpecificAnimations(sectionId) {
        switch (sectionId) {
            case 'home':
            case 'about':
                setTimeout(() => this.animateCounters(), 400);
                break;
            case 'hospitals':
                setTimeout(() => this.animateHospitalCards(), 300);
                break;
            case 'contact':
                setTimeout(() => this.animateContactItems(), 300);
                break;
        }
    }

    updateActiveNav(activeSection) {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeSection}`) {
                link.classList.add('active');
            }
        });
    }

    handleInitialLoad() {
        const hash = window.location.hash.substring(1);
        const initialSection = hash || 'home';
        
        setTimeout(() => {
            this.navigateToSection(initialSection);
        }, 100);
    }

    handleHashChange() {
        const hash = window.location.hash.substring(1);
        const section = hash || 'home';
        if (section !== this.currentSection) {
            this.navigateToSection(section);
        }
    }

    handleScroll() {
        // Add any scroll-based functionality here
    }

    handleResize() {
        this.closeMobileMenu();
    }

    // Testimonial Carousel
    startTestimonialAutoplay() {
        this.testimonialInterval = setInterval(() => {
            if (this.currentSection === 'home' && document.visibilityState === 'visible') {
                this.nextTestimonial();
            }
        }, 6000);
    }

    stopTestimonialAutoplay() {
        if (this.testimonialInterval) {
            clearInterval(this.testimonialInterval);
            this.testimonialInterval = null;
        }
    }

    nextTestimonial() {
        this.currentTestimonial = this.currentTestimonial >= this.totalTestimonials ? 1 : this.currentTestimonial + 1;
        this.updateTestimonialDisplay();
    }

    previousTestimonial() {
        this.currentTestimonial = this.currentTestimonial <= 1 ? this.totalTestimonials : this.currentTestimonial - 1;
        this.updateTestimonialDisplay();
    }

    setCurrentTestimonial(slideNumber) {
        this.currentTestimonial = slideNumber;
        this.updateTestimonialDisplay();
        
        // Restart autoplay
        this.stopTestimonialAutoplay();
        this.startTestimonialAutoplay();
    }

    updateTestimonialDisplay() {
        const track = document.getElementById('testimonial-track');
        const cards = document.querySelectorAll('.testimonial-card');
        const dots = document.querySelectorAll('.dot');
        
        if (track) {
            const translateX = -(this.currentTestimonial - 1) * 100;
            track.style.transform = `translateX(${translateX}%)`;
        }
        
        cards.forEach((card, index) => {
            card.classList.toggle('active', index + 1 === this.currentTestimonial);
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === this.currentTestimonial);
        });
    }

    // Counter Animation
    animateCounters() {
        if (this.countersAnimated) return;
        
        const counters = document.querySelectorAll('.stat-number[data-target]');
        
        counters.forEach((counter, index) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2500;
            const startDelay = index * 200;
            
            setTimeout(() => {
                this.animateCounter(counter, target, duration);
            }, startDelay);
        });
        
        this.countersAnimated = true;
    }

    animateCounter(counter, target, duration) {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);
            
            counter.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                counter.textContent = target.toLocaleString() + '+';
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Modal Management
    openLoginModal() {
        console.log('Opening login modal');
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Focus first input
            setTimeout(() => {
                const firstInput = modal.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 100);
        } else {
            console.error('Login modal not found');
        }
    }

    closeLoginModal() {
        console.log('Closing login modal');
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    showLoginTab(tabName) {
        console.log('Switching to tab:', tabName);
        const tabs = document.querySelectorAll('.tab-content');
        const buttons = document.querySelectorAll('.tab-btn');
        
        tabs.forEach(tab => tab.classList.remove('active'));
        buttons.forEach(btn => btn.classList.remove('active'));
        
        const targetTab = document.getElementById(`${tabName}-tab`);
        const targetButton = tabName === 'login' ? 
            document.querySelector('.tab-btn:first-child') : 
            document.querySelector('.tab-btn:last-child');
        
        if (targetTab) targetTab.classList.add('active');
        if (targetButton) targetButton.classList.add('active');
    }

    // Form Handling
    setupForms() {
        console.log('Setting up forms');
        
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmit(contactForm);
            });
        }

        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLoginSubmit(loginForm);
            });
        }

        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegisterSubmit(registerForm);
            });
        }
    }

    handleContactSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        if (this.validateContactForm(data)) {
            setTimeout(() => {
                this.showNotification('Message sent successfully! We will get back to you within 2-4 hours.', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        } else {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    handleLoginSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing In...';
        submitBtn.disabled = true;
        
        if (this.validateLoginForm(data)) {
            setTimeout(() => {
                this.showNotification('Login successful! Welcome to your Patient Portal.', 'success');
                this.closeLoginModal();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1200);
        } else {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    handleRegisterSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        
        if (this.validateRegisterForm(data)) {
            setTimeout(() => {
                this.showNotification('Registration successful! Please check your email to verify your account.', 'success');
                this.closeLoginModal();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        } else {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    validateContactForm(data) {
        if (!data.name || !data.email || !data.phone || !data.message || !data.service) {
            this.showNotification('Please fill in all required fields.', 'error');
            return false;
        }
        
        if (!this.isValidEmail(data.email)) {
            this.showNotification('Please enter a valid email address.', 'error');
            return false;
        }
        
        return true;
    }

    validateLoginForm(data) {
        if (!data.email || !data.password) {
            this.showNotification('Please enter both email and password.', 'error');
            return false;
        }
        
        if (!this.isValidEmail(data.email)) {
            this.showNotification('Please enter a valid email address.', 'error');
            return false;
        }
        
        return true;
    }

    validateRegisterForm(data) {
        if (!data.name || !data.email || !data.phone || !data.password || !data.confirmPassword) {
            this.showNotification('Please fill in all required fields.', 'error');
            return false;
        }
        
        if (!this.isValidEmail(data.email)) {
            this.showNotification('Please enter a valid email address.', 'error');
            return false;
        }
        
        if (data.password !== data.confirmPassword) {
            this.showNotification('Passwords do not match.', 'error');
            return false;
        }
        
        if (data.password.length < 8) {
            this.showNotification('Password must be at least 8 characters long.', 'error');
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Hospital Filtering
    setupHospitalFilters() {
        console.log('Setting up hospital filters');
        
        const locationFilter = document.getElementById('location-filter');
        const specialtyFilter = document.getElementById('specialty-filter');
        
        if (locationFilter) {
            locationFilter.addEventListener('change', () => {
                console.log('Location filter changed:', locationFilter.value);
                this.filterHospitals();
            });
        }
        
        if (specialtyFilter) {
            specialtyFilter.addEventListener('change', () => {
                console.log('Specialty filter changed:', specialtyFilter.value);
                this.filterHospitals();
            });
        }
    }

    filterHospitals() {
        const locationFilter = document.getElementById('location-filter');
        const specialtyFilter = document.getElementById('specialty-filter');
        const hospitalCards = document.querySelectorAll('.hospital-card');
        
        const selectedLocation = locationFilter ? locationFilter.value.trim() : '';
        const selectedSpecialty = specialtyFilter ? specialtyFilter.value.trim() : '';
        
        console.log('Filtering hospitals:', { selectedLocation, selectedSpecialty });
        
        let visibleCount = 0;
        
        hospitalCards.forEach((card, index) => {
            const cardLocation = card.getAttribute('data-location');
            const cardSpecialty = card.getAttribute('data-specialty');
            
            const locationMatch = !selectedLocation || cardLocation === selectedLocation;
            const specialtyMatch = !selectedSpecialty || cardSpecialty === selectedSpecialty;
            const shouldShow = locationMatch && specialtyMatch;
            
            if (shouldShow) {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                }, index * 100);
                
                visibleCount++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        this.updateHospitalResultsMessage(visibleCount);
        console.log(`Visible hospitals: ${visibleCount}`);
    }

    updateHospitalResultsMessage(count) {
        const existingMessage = document.querySelector('.filter-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        if (count === 0) {
            const message = document.createElement('div');
            message.className = 'filter-results-message';
            message.innerHTML = `
                <div style="
                    text-align: center; 
                    padding: 60px 20px; 
                    color: var(--color-text-secondary);
                    background: var(--color-surface);
                    border-radius: var(--radius-lg);
                    border: 2px dashed var(--color-border);
                    margin: var(--space-32) 0;
                ">
                    <div style="font-size: 3rem; margin-bottom: var(--space-16); opacity: 0.5;">🏥</div>
                    <h3 style="margin-bottom: var(--space-8); color: var(--color-text);">No hospitals found</h3>
                    <p style="margin-bottom: var(--space-20);">Try adjusting your filters to see more results.</p>
                    <button onclick="window.mlSupportApp.clearHospitalFilters()" 
                            class="btn btn--outline btn--sm">Clear All Filters</button>
                </div>
            `;
            
            const hospitalsGrid = document.getElementById('hospitals-grid');
            if (hospitalsGrid) {
                hospitalsGrid.parentNode.insertBefore(message, hospitalsGrid.nextSibling);
            }
        }
    }

    clearHospitalFilters() {
        const locationFilter = document.getElementById('location-filter');
        const specialtyFilter = document.getElementById('specialty-filter');
        
        if (locationFilter) locationFilter.value = '';
        if (specialtyFilter) specialtyFilter.value = '';
        
        this.filterHospitals();
        this.showNotification('Filters cleared - showing all hospitals', 'info');
    }

    // Animation helpers
    animateHospitalCards() {
        const cards = document.querySelectorAll('.hospital-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            }, index * 150);
        });
    }

    animateContactItems() {
        const items = document.querySelectorAll('.contact-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
                item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            }, index * 100);
        });
    }

    // Notification System
    showNotification(message, type = 'info') {
        document.querySelectorAll('.notification').forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        const icons = {
            success: '✓',
            error: '⚠',
            warning: '!',
            info: 'i'
        };
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    width: 24px; 
                    height: 24px; 
                    border-radius: 50%; 
                    background: rgba(255, 255, 255, 0.2); 
                    font-weight: bold;
                ">${icons[type] || 'i'}</span>
                <span style="flex: 1;">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none; 
                    border: none; 
                    color: inherit; 
                    font-size: 20px; 
                    cursor: pointer; 
                    padding: 4px; 
                    border-radius: 50%;
                ">&times;</button>
            </div>
        `;
        
        const colors = {
            success: 'var(--color-success)',
            error: 'var(--color-error)',
            warning: 'var(--color-warning)',
            info: 'var(--color-info)'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 24px;
            background: ${colors[type]};
            color: white;
            padding: 16px 20px;
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-large);
            z-index: 3000;
            max-width: 400px;
            min-width: 300px;
            animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                setTimeout(() => notification.remove(), 400);
            }
        }, 5000);
    }

    // Intersection Observer
    observeElements() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-up');
                    }
                });
            }, { threshold: 0.1 });
            
            document.querySelectorAll('.service-card, .hospital-card, .stat-card').forEach(el => {
                observer.observe(el);
            });
        }
    }

    // Utility Functions
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    scrollToSection(sectionId) {
        this.navigateToSection(sectionId);
    }
}

// Global functions for HTML onclick handlers
window.openLoginModal = function() {
    if (window.mlSupportApp) {
        window.mlSupportApp.openLoginModal();
    }
};

window.closeLoginModal = function() {
    if (window.mlSupportApp) {
        window.mlSupportApp.closeLoginModal();
    }
};

window.showLoginTab = function(tabName) {
    if (window.mlSupportApp) {
        window.mlSupportApp.showLoginTab(tabName);
    }
};

window.nextTestimonial = function() {
    if (window.mlSupportApp) {
        window.mlSupportApp.nextTestimonial();
    }
};

window.previousTestimonial = function() {
    if (window.mlSupportApp) {
        window.mlSupportApp.previousTestimonial();
    }
};

window.currentTestimonial = function(slideNumber) {
    if (window.mlSupportApp) {
        window.mlSupportApp.setCurrentTestimonial(slideNumber);
    }
};

window.scrollToSection = function(sectionId) {
    if (window.mlSupportApp) {
        window.mlSupportApp.scrollToSection(sectionId);
    }
};

// Initialize app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.mlSupportApp = new MLSupportApp();
    });
} else {
    window.mlSupportApp = new MLSupportApp();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (window.mlSupportApp) {
        if (document.visibilityState === 'visible') {
            window.mlSupportApp.countersAnimated = false;
            if (['about', 'home'].includes(window.mlSupportApp.currentSection)) {
                setTimeout(() => {
                    window.mlSupportApp.animateCounters();
                }, 500);
            }
            window.mlSupportApp.startTestimonialAutoplay();
        } else {
            window.mlSupportApp.stopTestimonialAutoplay();
        }
    }
});

// Add required CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .hospital-card {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    body.menu-open {
        overflow: hidden;
    }
`;

if (document.head) {
    document.head.appendChild(style);
} else {
    document.addEventListener('DOMContentLoaded', () => {
        document.head.appendChild(style);
    });
}
document.addEventListener('DOMContentLoaded', function() {
    // --- Smooth Scrolling for Navigation Links ---
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Stop the instant jump

            let targetId = this.getAttribute('href');
            let targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // You may also want to update your existing scrollToSection function for consistency
    // If you don't have one, this is what it would look like.
    window.scrollToSection = function(sectionId) {
        let section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});