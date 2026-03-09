/* ============================================
   Golden Western - Gallery Slider
   ============================================ */

// Gallery Slider Function
function initGallerySlider() {
    const slider = document.getElementById('gallerySlider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentSlideEl = document.getElementById('currentSlide');
    const totalSlidesEl = document.getElementById('totalSlides');
    const thumbsContainer = document.getElementById('galleryThumbs');
    
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.gallery-slide');
    const totalSlides = slides.length;
    
    // Update total slides counter
    if (totalSlidesEl) {
        totalSlidesEl.textContent = totalSlides;
    }
    
    let currentSlide = 0;
    
    // Create thumbnails
    if (thumbsContainer) {
        slides.forEach((slide, index) => {
            const img = slide.querySelector('.gallery-image');
            const thumb = document.createElement('div');
            thumb.className = `gallery-thumbnail ${index === 0 ? 'active' : ''}`;
            thumb.dataset.index = index;
            
            if (img) {
                thumb.innerHTML = `<img src="${img.src}" alt="Thumbnail ${index + 1}">`;
            }
            
            thumb.addEventListener('click', () => goToSlide(index));
            thumbsContainer.appendChild(thumb);
        });
    }
    
    function updateSlider() {
        // Update slides
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        // Update thumbnails
        if (thumbsContainer) {
            const thumbs = thumbsContainer.querySelectorAll('.gallery-thumbnail');
            thumbs.forEach((thumb, index) => {
                thumb.classList.toggle('active', index === currentSlide);
            });
        }
        
        // Update counter
        if (currentSlideEl) {
            currentSlideEl.textContent = currentSlide + 1;
        }
        
        // Update button states
        if (prevBtn) prevBtn.disabled = currentSlide === 0;
        if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }
    
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlider();
        }
    }
    
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        }
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Only handle if gallery is visible
        const sliderSection = document.querySelector('.gallery-slider-section');
        if (!sliderSection) return;
        
        const rect = sliderSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (!isVisible) return;
        
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            prevSlide();
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            nextSlide();
        }
    });
    
    // Initialize
    updateSlider();
    
    return {
        goToSlide,
        nextSlide,
        prevSlide
    };
}

// ============================================
// Initialize on DOM Ready
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initGallerySlider();
});

