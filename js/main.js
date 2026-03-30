/**
 * SavorFarm Main JS
 * Handles animations, counters, and tab interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    initRevealAnimations();
    initCounters();
    initTabs();
    initSmoothScroll();
    initHeroWaveAnimation();
    initHeaderScroll();
});

/**
 * Reveal on Scroll Animations
 */
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-item');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stagger-item')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 100}ms`;
                }
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    reveals.forEach(el => revealObserver.observe(el));
}

/**
 * Counter Animation
 */
function initCounters() {
    const counterSection = document.getElementById('counter-section');
    if (!counterSection) return;

    const counters = document.querySelectorAll('[data-target]');
    
    const animateCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const duration = 2000;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);
            
            const suffix = target >= 2 ? (target === 2 ? 'M' : '+') : '+';
            el.innerText = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.innerText = target + suffix;
            }
        };
        
        requestAnimationFrame(updateCounter);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => animateCounter(counter));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(counterSection);
}

/**
 * Tab System Refined
 */
function initTabs() {
    const tabInputs = document.querySelectorAll('input[name="state-tabs"]');
    const tabContents = document.querySelectorAll('.tab-content');

    const updateTabs = (selectedId) => {
        tabContents.forEach(content => {
            if (content.classList.contains(`content-${selectedId}`)) {
                content.style.display = 'grid';
                setTimeout(() => content.classList.add('active'), 10);
            } else {
                content.classList.remove('active');
                setTimeout(() => {
                    if (!content.classList.contains('active')) {
                        content.style.display = 'none';
                    }
                }, 500);
            }
        });
        
        // Update label styles
        document.querySelectorAll('label[for^="tab-"]').forEach(label => {
            if (label.getAttribute('for') === `tab-${selectedId}`) {
                label.style.color = '#9f411e';
                label.style.borderBottomColor = '#9f411e';
            } else {
                label.style.color = '';
                label.style.borderBottomColor = '';
            }
        });
    };

    tabInputs.forEach(input => {
        input.addEventListener('change', () => {
            const id = input.id.replace('tab-', '');
            updateTabs(id);
        });
    });

    // Initialize first tab
    const checkedTab = document.querySelector('input[name="state-tabs"]:checked');
    if (checkedTab) {
        updateTabs(checkedTab.id.replace('tab-', ''));
    }
}

/**
 * Smooth Scrolling
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Hero Wave Parallax Animation
 */
function initHeroWaveAnimation() {
    const heroWave = document.querySelector('.hero-wave');
    if (!heroWave) return;

    const handleScroll = () => {
        const scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            heroWave.style.transform = `translate3d(0, ${scrolled * 0.35}px, 0)`;
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Header Scroll Behavior
 * Toggles 'scrolled' class based on scroll position.
 */
function initHeaderScroll() {
    const header = document.querySelector('nav');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}
