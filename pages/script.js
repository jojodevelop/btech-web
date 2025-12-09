/**
 * BTech Level 8 - Shared JavaScript Functions
 * This file contains reusable functions for all pages
 */

// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navbar = document.querySelector('.navbar');
const currentYearEl = document.getElementById('currentYear');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
    
    // Initialize navigation
    initNavigation();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize mobile menu
    initMobileMenu();
});

// ============================================
// NAVIGATION FUNCTIONS
// ============================================

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', handleClickOutside);
    
    // Close mobile menu when clicking a link
    const navLinksList = document.querySelectorAll('.nav-link');
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    });
}

/**
 * Handle navbar scroll effect
 */
function handleNavbarScroll() {
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', toggleMobileMenu);
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    
    // Update toggle button icon
    if (navLinks.classList.contains('active')) {
        menuToggle.innerHTML = '<i class="fas fa-times"></i>';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = ''; // Restore scrolling
    }
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    navLinks.classList.remove('active');
    if (menuToggle) {
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
    document.body.style.overflow = ''; // Restore scrolling
}

/**
 * Handle clicks outside mobile menu
 */
function handleClickOutside(event) {
    if (navLinks && navLinks.classList.contains('active') &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)) {
        closeMobileMenu();
    }
}

// ============================================
// ANIMATION FUNCTIONS
// ============================================

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length > 0) {
        // Set initial state
        fadeElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        // Create observer for scroll animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe each fade element
        fadeElements.forEach(element => {
            observer.observe(element);
        });
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Format date to readable string
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise} Promise that resolves when text is copied
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
}

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        z-index: 9999;
        box-shadow: var(--shadow-lg);
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    // Add keyframes for animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after duration
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
    
    document.body.appendChild(notification);
}

/**
 * Get notification icon based on type
 */
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

/**
 * Get notification color based on type
 */
function getNotificationColor(type) {
    const colors = {
        success: 'linear-gradient(90deg, #10b981, #34d399)',
        error: 'linear-gradient(90deg, #ef4444, #f87171)',
        warning: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
        info: 'linear-gradient(90deg, #3b82f6, #60a5fa)'
    };
    return colors[type] || colors.info;
}

// ============================================
// FORM VALIDATION
// ============================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone is valid
 */
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
}

/**
 * Show form validation error
 * @param {HTMLElement} input - Input element
 * @param {string} message - Error message
 */
function showFormError(input, message) {
    // Remove existing error
    const existingError = input.parentNode.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error element
    const error = document.createElement('div');
    error.className = 'form-error';
    error.textContent = message;
    error.style.cssText = `
        color: #ef4444;
        font-size: 0.85rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    // Add error icon
    const icon = document.createElement('i');
    icon.className = 'fas fa-exclamation-circle';
    error.prepend(icon);
    
    // Add error class to input
    input.classList.add('error');
    input.style.borderColor = '#ef4444';
    
    // Add error element after input
    input.parentNode.appendChild(error);
    
    // Focus on input
    input.focus();
}

/**
 * Clear form validation error
 * @param {HTMLElement} input - Input element
 */
function clearFormError(input) {
    input.classList.remove('error');
    input.style.borderColor = '';
    
    const error = input.parentNode.querySelector('.form-error');
    if (error) {
        error.remove();
    }
}

// ============================================
// MODAL FUNCTIONS
// ============================================

/**
 * Create and show modal
 * @param {Object} options - Modal options
 * @param {string} options.title - Modal title
 * @param {string} options.content - Modal content (HTML)
 * @param {Function} options.onClose - Callback when modal closes
 * @param {boolean} options.closeOnOutsideClick - Close when clicking outside
 */
function showModal(options) {
    // Remove existing modal
    const existingModal = document.getElementById('dynamic-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'dynamic-modal';
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9998;
        padding: 1rem;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
        background: var(--bg-card);
        border-radius: var(--radius-lg);
        padding: 2.5rem;
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        animation: slideUp 0.3s ease;
    `;
    
    // Add keyframes for animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Create modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    modalHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    const modalTitle = document.createElement('h3');
    modalTitle.textContent = options.title || 'Modal';
    modalTitle.style.cssText = `
        margin: 0;
        color: var(--accent-primary);
    `;
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: var(--text-primary);
        font-size: 1.5rem;
        cursor: pointer;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s ease;
    `;
    closeButton.addEventListener('mouseenter', () => {
        closeButton.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    closeButton.addEventListener('mouseleave', () => {
        closeButton.style.background = 'none';
    });
    
    // Create modal body
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    modalBody.innerHTML = options.content || '';
    
    // Assemble modal
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Close modal function
    function closeModal() {
        modalOverlay.style.animation = 'fadeOut 0.3s ease forwards';
        modalContent.style.animation = 'slideDown 0.3s ease forwards';
        
        // Add fadeOut and slideDown animations
        const closeStyle = document.createElement('style');
        closeStyle.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            @keyframes slideDown {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(30px); opacity: 0; }
            }
        `;
        document.head.appendChild(closeStyle);
        
        setTimeout(() => {
            document.body.removeChild(modalOverlay);
            document.body.style.overflow = '';
            
            if (options.onClose) {
                options.onClose();
            }
        }, 300);
    }
    
    // Close on button click
    closeButton.addEventListener('click', closeModal);
    
    // Close on escape key
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
    
    // Close on outside click
    if (options.closeOnOutsideClick !== false) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
    
    return {
        close: closeModal,
        updateContent: (newContent) => {
            modalBody.innerHTML = newContent;
        }
    };
}

// ============================================
// LOADING STATE
// ============================================

/**
 * Show loading spinner
 * @param {HTMLElement} element - Element to show loading state on
 * @param {string} loadingText - Loading text (optional)
 */
function showLoading(element, loadingText = 'Loading...') {
    if (!element) return;
    
    // Save original content
    element.setAttribute('data-original-content', element.innerHTML);
    element.setAttribute('data-original-disabled', element.disabled);
    
    // Set loading state
    element.innerHTML = `
        <i class="fas fa-spinner fa-spin" style="margin-right: 0.5rem;"></i>
        ${loadingText}
    `;
    element.disabled = true;
}

/**
 * Hide loading spinner
 * @param {HTMLElement} element - Element to restore
 */
function hideLoading(element) {
    if (!element) return;
    
    // Restore original content
    const originalContent = element.getAttribute('data-original-content');
    const originalDisabled = element.getAttribute('data-original-disabled');
    
    if (originalContent) {
        element.innerHTML = originalContent;
        element.removeAttribute('data-original-content');
    }
    
    if (originalDisabled !== null) {
        element.disabled = originalDisabled === 'true';
        element.removeAttribute('data-original-disabled');
    }
}

// ============================================
// API FUNCTIONS (for future use)
// ============================================

/**
 * Make API request with error handling
 * @param {string} url - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise} Promise with response data
 */
async function apiRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'same-origin'
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, mergedOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('API request failed:', error);
        return { 
            success: false, 
            error: error.message || 'Network error occurred' 
        };
    }
}

// Export functions for use in other files
window.BTechApp = {
    initNavigation,
    initScrollAnimations,
    showNotification,
    isValidEmail,
    isValidPhone,
    showModal,
    showLoading,
    hideLoading,
    apiRequest,
    debounce,
    throttle,
    formatDate,
    copyToClipboard
};