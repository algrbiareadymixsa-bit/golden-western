/* ============================================
   Golden Western - Animated Stats Counter
   ============================================ */

// Counter animation logic
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (!counters.length) return;

    function updateCounter() {
        counters.forEach(counter => {
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
        });
    }

    // Intersection Observer for triggering animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateCounter();
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });

    counters.forEach(counter => observer.observe(counter));
}

// Initialize project data population
function populateProjectData() {
    const projectData = {
        project1: { year: 2026, m3: '250,000', units: '60,000' },
        project2: { year: 2024, m3: '35,000', units: '46' },
        project3: { year: 2023, m3: '60,000', units: '500,000' },
        project4: { year: 2025, m3: '22,000', units: '8' },
        project5: { year: 2024, m3: '18,000', units: '6' }
    };
    
    for (const key in projectData) {
        if (projectData.hasOwnProperty(key)) {
            const data = projectData[key];
            const meta1Value = document.getElementById(`${key}-meta1-value`);
            const meta2Value = document.getElementById(`${key}-meta2-value`);
            const meta3Value = document.getElementById(`${key}-meta3-value`);

            if (meta1Value) meta1Value.textContent = data.year;
            if (meta2Value) meta2Value.textContent = `${data.m3} م³`;
            if (meta3Value) meta3Value.textContent = data.units;
        }
    }
}

// ============================================
// Initialize on DOM Ready
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    animateCounters();
    populateProjectData();
});

