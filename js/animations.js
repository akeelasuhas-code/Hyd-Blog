// Sakura Animation System
class SakuraAnimation {
    constructor() {
        this.container = document.getElementById('sakura-container');
        this.petals = [];
        this.maxPetals = window.innerWidth < 768 ? 10 : 18;
        this.animationId = null;
        this.isEnabled = true;

        // Check for reduced motion preference
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.init();
    }

    init() {
        if (this.prefersReducedMotion) {
            // Create static sakura decorations instead of animations
            this.createStaticSakura();
            return;
        }

        this.createPetals();
        this.startAnimation();

        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));

        // Handle visibility change to pause animations when tab is not visible
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    createStaticSakura() {
        // Create a few static sakura elements for users who prefer reduced motion
        for (let i = 0; i < 5; i++) {
            const petal = document.createElement('div');
            petal.className = 'sakura-petal';
            petal.style.cssText = `
                position: fixed;
                width: 30px;
                height: 30px;
                background-image: url('../assets/sakura.svg');
                background-size: contain;
                background-repeat: no-repeat;
                opacity: 0.3;
                top: ${Math.random() * 70}%;
                left: ${Math.random() * 90}%;
                z-index: 1;
                pointer-events: none;
            `;
            this.container.appendChild(petal);
        }
    }

    createPetals() {
        for (let i = 0; i < this.maxPetals; i++) {
            setTimeout(() => {
                this.createPetal();
            }, i * 300); // Stagger petal creation
        }
    }

    createPetal() {
        const petal = document.createElement('div');
        petal.className = 'sakura-petal';

        // Randomize petal properties
        const size = Math.random() * 20 + 20; // 20-40px
        const duration = Math.random() * 10 + 15; // 15-25 seconds
        const delay = Math.random() * 5;
        const startX = Math.random() * window.innerWidth;
        const swayAmount = Math.random() * 80 + 40; // Increased sway for more dramatic movement
        const rotationSpeed = Math.random() * 3 + 1; // Rotation speed multiplier
        const windEffect = Math.random() * 30 - 15; // Wind effect (-15 to +15)

        // Set petal styles
        petal.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${startX}px;
            top: -100px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            --sway-amount: ${swayAmount}px;
            --rotation-speed: ${rotationSpeed};
            --wind-effect: ${windEffect}px;
            will-change: transform, opacity;
        `;

        // Add enhanced animation with realistic physics
        this.addEnhancedAnimation(petal, duration, swayAmount, rotationSpeed, windEffect);

        this.container.appendChild(petal);
        this.petals.push(petal);

        // Remove petal after animation completes
        setTimeout(() => {
            this.removePetal(petal);
        }, (duration + delay) * 1000);
    }

    addEnhancedAnimation(petal, duration, swayAmount, rotationSpeed, windEffect) {
        const animationId = `enhanced-sakura-${Date.now()}-${Math.random()}`;

        // Create enhanced keyframes with realistic physics
        const keyframes = `
            @keyframes ${animationId} {
                0% {
                    transform: translateY(-100px) translateX(0) rotateZ(0deg);
                    opacity: 0;
                }
                5% {
                    opacity: 0.6;
                }
                15% {
                    transform: translateY(15vh) translateX(${swayAmount * 0.3}px) rotateZ(${rotationSpeed * 45}deg);
                }
                25% {
                    transform: translateY(25vh) translateX(${-swayAmount * 0.2 + windEffect}px) rotateZ(${-rotationSpeed * 30}deg);
                }
                35% {
                    transform: translateY(35vh) translateX(${swayAmount * 0.6}px) rotateZ(${rotationSpeed * 60}deg);
                }
                50% {
                    transform: translateY(50vh) translateX(${-swayAmount * 0.4 + windEffect * 1.5}px) rotateZ(${-rotationSpeed * 90}deg);
                }
                65% {
                    transform: translateY(65vh) translateX(${swayAmount * 0.8}px) rotateZ(${rotationSpeed * 120}deg);
                }
                75% {
                    transform: translateY(75vh) translateX(${-swayAmount * 0.3 + windEffect * 2}px) rotateZ(${-rotationSpeed * 60}deg);
                }
                85% {
                    opacity: 0.6;
                }
                95% {
                    transform: translateY(95vh) translateX(${swayAmount * 0.5 + windEffect * 3}px) rotateZ(${rotationSpeed * 180}deg);
                }
                100% {
                    transform: translateY(calc(100vh + 100px)) translateX(${swayAmount + windEffect * 4}px) rotateZ(${rotationSpeed * 360}deg);
                    opacity: 0;
                }
            }
        `;

        // Add keyframes to document
        const styleSheet = document.createElement('style');
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);

        // Apply the enhanced animation
        petal.style.animation = `${animationId} ${duration}s linear infinite`;

        // Store animation reference for cleanup
        petal.dataset.animationId = animationId;
        petal.dataset.styleSheetId = styleSheet.textContent.length;
    }

    removePetal(petal) {
        const index = this.petals.indexOf(petal);
        if (index > -1) {
            this.petals.splice(index, 1);
        }

        // Clean up animation styles
        if (petal.dataset.animationId) {
            // Find and remove the style element for this animation
            const styles = document.querySelectorAll('style');
            styles.forEach(style => {
                if (style.textContent.includes(petal.dataset.animationId)) {
                    style.remove();
                }
            });
        }

        if (petal.parentNode) {
            petal.parentNode.removeChild(petal);
        }

        // Create new petal to maintain consistent number
        if (this.isEnabled && !this.prefersReducedMotion) {
            setTimeout(() => {
                this.createPetal();
            }, Math.random() * 2000);
        }
    }

    // Legacy method for backwards compatibility
    addSwayAnimation(petal, duration, swayAmount) {
        this.addEnhancedAnimation(petal, duration, swayAmount, 1.5, 0);
    }

    handleResize() {
        // Adjust petal count based on screen size
        const newMaxPetals = window.innerWidth < 768 ? 10 : 18;

        if (newMaxPetals < this.maxPetals) {
            // Remove excess petals
            while (this.petals.length > newMaxPetals) {
                const petal = this.petals.pop();
                if (petal && petal.parentNode) {
                    petal.parentNode.removeChild(petal);
                }
            }
        } else if (newMaxPetals > this.maxPetals) {
            // Add more petals
            const toAdd = newMaxPetals - this.petals.length;
            for (let i = 0; i < toAdd; i++) {
                setTimeout(() => {
                    this.createPetal();
                }, i * 500);
            }
        }

        this.maxPetals = newMaxPetals;
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.pauseAnimations();
        } else {
            this.resumeAnimations();
        }
    }

    pauseAnimations() {
        this.petals.forEach(petal => {
            petal.style.animationPlayState = 'paused';
        });
    }

    resumeAnimations() {
        this.petals.forEach(petal => {
            petal.style.animationPlayState = 'running';
        });
    }

    startAnimation() {
        this.isEnabled = true;
    }

    stopAnimation() {
        this.isEnabled = false;
        this.petals.forEach(petal => {
            if (petal.parentNode) {
                petal.parentNode.removeChild(petal);
            }
        });
        this.petals = [];
    }

    // Performance monitoring
    checkPerformance() {
        // If frame rate drops significantly, reduce petals
        let lastTime = performance.now();
        let frames = 0;

        const measureFPS = () => {
            frames++;
            const currentTime = performance.now();

            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frames * 1000) / (currentTime - lastTime));

                if (fps < 30 && this.maxPetals > 5) {
                    // Reduce petals for better performance
                    this.maxPetals = Math.max(5, this.maxPetals - 3);
                    this.handleResize();
                }

                frames = 0;
                lastTime = currentTime;
            }

            if (this.isEnabled) {
                requestAnimationFrame(measureFPS);
            }
        };

        requestAnimationFrame(measureFPS);
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on modern browsers that support the features we need
    if (window.CSS && window.CSS.supports && window.CSS.supports('animation', 'float 15s linear')) {
        const sakuraAnimation = new SakuraAnimation();

        // Optional: Start performance monitoring after a short delay
        setTimeout(() => {
            sakuraAnimation.checkPerformance();
        }, 5000);
    }
});

// Handle page unload to clean up
window.addEventListener('beforeunload', () => {
    const container = document.getElementById('sakura-container');
    if (container) {
        container.innerHTML = '';
    }
});