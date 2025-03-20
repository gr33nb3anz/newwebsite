/**
 * Nimbus Cleaning Services - Global JavaScript
 * 
 * This file contains all global JavaScript functionality for the Nimbus website.
 * Individual page-specific scripts should be added in their respective page files
 * or in separate modules as needed.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components when the DOM is fully loaded
    initMobileMenu();
    initStickyHeader();
    initBackToTop();
    initMobileDropdowns();
    initDesktopDropdowns();
    updateCopyrightYear();
    
    // Initialize any page-specific components that might exist
    initAccordions();
    initTabs();
    initFlipCards();
});

/**
 * Mobile Menu Functionality
 * Handles toggling the mobile menu on smaller screens
 */
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    
    // Exit if elements don't exist
    if (!mobileToggle || !mobileMenu) return;
    
    mobileToggle.addEventListener('click', function() {
        // Toggle classes
        body.classList.toggle('nav-open');
        mobileMenu.classList.toggle('active');
        
        // Update ARIA attributes
        const isExpanded = mobileMenu.classList.contains('active');
        mobileToggle.setAttribute('aria-expanded', isExpanded);
        mobileMenu.setAttribute('aria-hidden', !isExpanded);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (body.classList.contains('nav-open') && 
            !mobileMenu.contains(event.target) && 
            !mobileToggle.contains(event.target)) {
            body.classList.remove('nav-open');
            mobileMenu.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', false);
            mobileMenu.setAttribute('aria-hidden', true);
        }
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && body.classList.contains('nav-open')) {
            body.classList.remove('nav-open');
            mobileMenu.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', false);
            mobileMenu.setAttribute('aria-hidden', true);
        }
    });
}

/**
 * Desktop Dropdown Functionality
 * Handles dropdown menus in desktop view
 */
function initDesktopDropdowns() {
    const dropdownToggles = document.querySelectorAll('.main-nav .dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get dropdown menu ID from aria-controls
            const dropdownId = this.getAttribute('aria-controls');
            const dropdown = document.getElementById(dropdownId);
            
            if (!dropdown) return;
            
            // Toggle expanded state
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Optional: close other open dropdowns at the same level
            const siblings = Array.from(this.closest('ul').querySelectorAll('.dropdown-toggle[aria-expanded="true"]'))
                .filter(item => item !== this);
                
            siblings.forEach(sibling => {
                sibling.setAttribute('aria-expanded', false);
            });
        });
    });
}

/**
 * Mobile Dropdown Functionality
 * Handles nested dropdown menus in mobile view
 */
function initMobileDropdowns() {
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    
    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get dropdown menu ID from aria-controls
            const dropdownId = this.getAttribute('aria-controls');
            const dropdown = document.getElementById(dropdownId);
            
            if (!dropdown) return;
            
            // Toggle active class on submenu and aria-expanded state
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            dropdown.classList.toggle('active');
            
            // Close other open submenus at the same level
            const parentLi = this.parentElement;
            const siblings = Array.from(parentLi.parentElement.children)
                .filter(item => item !== parentLi && item.classList.contains('mobile-dropdown'));
                
            siblings.forEach(sibling => {
                const siblingToggle = sibling.querySelector('.mobile-dropdown-toggle');
                const siblingMenu = sibling.querySelector('.mobile-submenu');
                
                if (siblingToggle) siblingToggle.setAttribute('aria-expanded', false);
                if (siblingMenu) siblingMenu.classList.remove('active');
            });
        });
    });
}

/**
 * Sticky Header Functionality
 * Adds a class to the header when scrolling down
 */
function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    
    // Function to check scroll position
    function checkScroll() {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Check on load
    checkScroll();
    
    // Check on scroll with throttle for performance
    let scrollTimer;
    window.addEventListener('scroll', function() {
        if (scrollTimer) return;
        
        scrollTimer = setTimeout(function() {
            checkScroll();
            scrollTimer = null;
        }, 100);
    });
}

/**
 * Back to Top Button Functionality
 * Shows/hides the back to top button based on scroll position
 */
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;
    
    // Show button after scrolling down
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top when clicked
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Update Copyright Year
 * Dynamically sets the current year in the copyright notice
 */
function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Accordion Functionality
 * For FAQ and other expandable content sections
 */
function initAccordions() {
    const accordionButtons = document.querySelectorAll('.faq-question, [data-accordion-toggle]');
    
    accordionButtons.forEach(button => {
        if (!button) return;
        
        button.addEventListener('click', function() {
            // Toggle expanded state
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Find the corresponding answer/content
            const target = this.nextElementSibling;
            if (target) {
                // Optional: close other open accordions
                if (!isExpanded) {
                    const parentContainer = this.closest('.faq-section, .accordion-container');
                    if (parentContainer) {
                        const siblingButtons = parentContainer.querySelectorAll('.faq-question[aria-expanded="true"], [data-accordion-toggle][aria-expanded="true"]');
                        siblingButtons.forEach(siblingButton => {
                            if (siblingButton !== this) {
                                siblingButton.setAttribute('aria-expanded', false);
                            }
                        });
                    }
                }
            }
        });
        
        // Add keyboard support
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Tab Functionality
 * For tabbed content sections
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button, [data-tab-toggle]');
    
    tabButtons.forEach(button => {
        if (!button) return;
        
        button.addEventListener('click', function() {
            // Get tab ID or data attribute
            const tabId = this.getAttribute('data-tab') || this.getAttribute('href')?.substring(1);
            if (!tabId) return;
            
            // Find tab container
            const tabContainer = this.closest('.tab-container, [data-tabs]');
            if (!tabContainer) return;
            
            // Deactivate all tabs in this container
            const siblingButtons = tabContainer.querySelectorAll('.tab-button, [data-tab-toggle]');
            siblingButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            
            // Deactivate all tab content
            const tabContents = document.querySelectorAll(`#${tabId}, [data-tab-content="${tabId}"]`);
            const allContents = tabContainer.querySelectorAll('.tab-content, [data-tab-content]');
            allContents.forEach(content => {
                content.classList.remove('active');
                content.setAttribute('aria-hidden', 'true');
            });
            
            // Activate current tab and content
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            tabContents.forEach(content => {
                content.classList.add('active');
                content.setAttribute('aria-hidden', 'false');
            });
        });
        
        // Add keyboard support
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Flip Card Functionality
 * For before/after comparisons and service info cards
 */
function initFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card');
    
    flipCards.forEach(card => {
        if (!card) return;
        
        // For click functionality
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
        
        // Make cards focusable for accessibility
        if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
        }
        
        // For keyboard accessibility
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.classList.toggle('flipped');
            }
        });
    });
}

/**
 * Utility Functions
 * Reusable helper functions for various components
 */

// Debounce function to limit function calls (for scroll events, etc.)
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Smooth scroll to element (for anchor links)
function scrollToElement(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}
