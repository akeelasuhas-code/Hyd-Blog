/**
 * Katana Preloader - Elegant blade swipe animation
 * Performance-optimized preloader with Samurai aesthetic
 */
class KatanaPreloader {
    constructor() {
        this.container = null;
        this.isVisible = true;
        this.hideTimeout = null;

        this.init();
    }

    init() {
        // Create preloader if not already in DOM
        this.container = document.getElementById('katana-preloader');
        if (!this.container) {
            this.createPreloader();
        }

        // Auto-hide after elegant reveal
        this.scheduleHide();

        // Handle page visibility for performance
        this.setupVisibilityHandling();

        // Add reduced motion support
        this.setupAccessibility();
    }

    createPreloader() {
        this.container = document.createElement('div');
        this.container.id = 'katana-preloader';
        this.container.className = 'katana-container';
        this.container.setAttribute('aria-hidden', 'true');
        this.container.setAttribute('role', 'presentation');

        const blade = document.createElement('div');
        blade.className = 'katana-blade';

        this.container.appendChild(blade);
        document.body.appendChild(this.container);
    }

    scheduleHide() {
        // Hide after elegant 1.5s animation completes
        this.hideTimeout = setTimeout(() => {
            this.hide();
        }, 1600);
    }

    hide() {
        if (!this.isVisible) return;

        this.isVisible = false;

        // Fade out with smooth transition
        this.container.style.transition = 'opacity 0.3s ease-out';
        this.container.style.opacity = '0';

        // Remove from DOM after fade
        setTimeout(() => {
            if (this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
        }, 300);
    }

    forceHide() {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }
        this.hide();
    }

    setupVisibilityHandling() {
        // Pause/resume based on page visibility for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause animations when tab not visible
                this.container.style.animationPlayState = 'paused';
            } else {
                // Resume when visible again
                this.container.style.animationPlayState = 'running';
            }
        });
    }

    setupAccessibility() {
        // Respect reduced motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        const handleReducedMotion = (e) => {
            if (e.matches) {
                // Disable animations for users who prefer reduced motion
                this.container.style.display = 'none';
                this.forceHide();
            }
        };

        // Check initial preference
        handleReducedMotion(prefersReducedMotion);

        // Listen for changes
        prefersReducedMotion.addEventListener('change', handleReducedMotion);
    }

    // Public method to manually control preloader
    show() {
        if (this.isVisible) return;

        this.isVisible = true;
        this.container.style.display = 'flex';
        this.container.style.opacity = '1';

        // Restart animation
        const blade = this.container.querySelector('.katana-blade');
        if (blade) {
            blade.style.animation = 'none';
            blade.offsetHeight; // Trigger reflow
            blade.style.animation = null;
        }

        this.scheduleHide();
    }
}

// Initialize preloader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.katanaPreloader = new KatanaPreloader();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KatanaPreloader;
}