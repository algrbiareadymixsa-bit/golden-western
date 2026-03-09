/* ============================================
   Golden Western - Animated Stats Counter
   ============================================ */

// Counter animation logic
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    if (!counters.length) return;

    function updateCounter(counter) {
        const target = parseInt(counter.dataset.count);
        if (isNaN(target)) return;
        
        const duration = 2000;
        const start = performance.now();

        function step(timestamp) {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);
            
            counter.textContent = current + '+';

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                counter.textContent = target + '+';
            }
        }
        requestAnimationFrame(step);
    }

    // Intersection Observer for triggering animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });

    counters.forEach(counter => observer.observe(counter));
}

// ============================================
// Initialize on DOM Ready
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    animateCounters();
});

