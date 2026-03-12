/* ============================================
   Golden Western - Gallery Slider
   ============================================ */

// Gallery Slider Function
function createGallerySlider(sliderId, totalItems, titlePrefix, imagePath, thumbPath) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    
    const prevBtn = document.getElementById(sliderId.replace('-slider', '-prev-btn'));
    const nextBtn = document.getElementById(sliderId.replace('-slider', '-next-btn'));
    const counter = document.getElementById(sliderId.replace('-slider', '-counter'));
    const thumbnails = document.getElementById(sliderId.replace('-slider', '-thumbnails'));
    
    let currentSlide = 0;
    
    // Create slides
    for (let i = 0; i < totalItems; i++) {
        const slide = document.createElement('div');
        slide.className = `gallery-slide ${i === 0 ? 'active' : ''}`;
        slide.id = `${sliderId}-slide-${i}`;
        
        const imgNumber = i + 1;
        const imageSrc = `${imagePath}${imgNumber}.jpg`;
        
        slide.innerHTML = `
            <div class="gallery-image-container">
                <img src="${imageSrc}" alt="${titlePrefix} ${imgNumber}" class="gallery-image" 
                     onerror="this.src='https://via.placeholder.com/707x1000/003366/FFD700?text=${titlePrefix}+${imgNumber}'">
            </div>
            <div class="gallery-slide-content">
                <div class="gallery-number">${imgNumber}</div>
                <div class="gallery-title">${titlePrefix} ${imgNumber}</div>
            </div>
        `;
        
        slider.appendChild(slide);
    }
    
    // Create thumbnails
    if (thumbnails) {
        for (let i = 0; i < totalItems; i++) {
            const imgNumber = i + 1;
            const thumbnail = document.createElement('div');
            thumbnail.className = `gallery-thumbnail ${i === 0 ? 'active' : ''}`;
            thumbnail.dataset.index = i;
            
            const thumbSrc = `${thumbPath}${imgNumber}.jpg`;
            thumbnail.innerHTML = `
                <img src="${thumbSrc}" alt="${titlePrefix} ${imgNumber}" 
                     onerror="this.src='https://via.placeholder.com/60x85/003366/FFD700?text=${imgNumber}'">
            `;
            
            thumbnail.addEventListener('click', () => goToSlide(i));
            thumbnails.appendChild(thumbnail);
        }
    }
    
    function updateSlider() {
        // Update slides
        document.querySelectorAll(`#${sliderId} .gallery-slide`).forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        // Update thumbnails
        if (thumbnails) {
            thumbnails.querySelectorAll('.gallery-thumbnail').forEach((thumb, index) => {
                thumb.classList.toggle('active', index === currentSlide);
            });
        }
        
        // Update counter
        if (counter) {
            counter.textContent = `${currentSlide + 1} / ${totalItems}`;
        }
        
        // Update button states
        if (prevBtn) prevBtn.disabled = currentSlide === 0;
        if (nextBtn) nextBtn.disabled = currentSlide === totalItems - 1;
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }
    
    function nextSlide() {
        if (currentSlide < totalItems - 1) {
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
        const sliderElement = document.getElementById(sliderId);
        if (!sliderElement || !sliderElement.closest('.gallery-slider-section')) return;
        
        if (e.key === 'ArrowLeft' && currentSlide > 0) {
            prevSlide();
        } else if (e.key === 'ArrowRight' && currentSlide < totalItems - 1) {
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

// Initialize all galleries
function setupGalleries() {
    // Certificates Gallery (12 items)
    createGallerySlider(
        'certificates-slider', 
        12, 
        'شهادة', 
        'assets/images/gallery/certs/cert_', 
        'assets/images/gallery/certs/cert_'
    );
    
    // Approvals Gallery (15 items)
    createGallerySlider(
        'approvals-slider', 
        15, 
        'وثيقة اعتماد', 
        'assets/images/gallery/approvals/approval_', 
        'assets/images/gallery/approvals/approval_'
    );
}

// ============================================
// Project Modal Functions
// ============================================

const projectModal = document.getElementById('projectModal');

function openProjectModal(projectId) {
    const projectTitle = document.getElementById(`project${projectId}-title`);
    const videoContainer = document.getElementById('videoContainer');
    const mockProjectsGrid = document.getElementById('mockProjectsGrid');
    
    if (!projectModal || !projectTitle) return;
    
    const title = projectTitle ? projectTitle.textContent : 'مشروع';
    const videoUrl = projectVideos[projectId];
    const projects = mockProjects[projectId];
    
    // Update modal title
    const modalProjectTitle = document.getElementById('modalProjectTitle');
    if (modalProjectTitle) modalProjectTitle.textContent = title;
    
    // Load YouTube video
    if (videoContainer) {
        videoContainer.innerHTML = videoUrl ? 
            `<iframe src="${videoUrl}" title="فيديو المشروع" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` : '';
    }
    
    // Load mock projects
    if (mockProjectsGrid) {
        mockProjectsGrid.innerHTML = '';
        if (projects) {
            projects.forEach(project => {
                const projectLink = document.createElement('a');
                projectLink.className = 'mock-project-link';
                projectLink.href = project.url || '#';
                projectLink.target = '_blank';
                projectLink.innerHTML = `
                    <i class="fas fa-external-link-alt"></i>
                    <div class="mock-project-info">
                        <h4>${project.title}</h4>
                        <p>${project.desc}</p>
                    </div>
                `;
                mockProjectsGrid.appendChild(projectLink);
            });
        }
    }
    
    // Show modal
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    if (projectModal) {
        projectModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Clear video to stop playback
        const videoContainer = document.getElementById('videoContainer');
        if (videoContainer) videoContainer.innerHTML = '';
    }
}

// Project data
const projectVideos = {
    1: 'https://www.youtube.com/embed/4bn6u8oCxr8',
    2: 'https://www.youtube.com/embed/iS5SPcN0lHs',
    3: 'https://www.youtube.com/embed/AJFkU1bC3C0',
    4: 'https://www.youtube.com/embed/vY2F-Sq4izA',
    5: 'https://www.youtube.com/embed/vY2F-Sq4izA'
};

const mockProjects = {
    1: [
        { title: 'استاد الرياض', desc: 'سعة 80,000 مقعد', url: '#' },
        { title: 'استاد الملك عبدالله', desc: 'سعة 62,000 مقعد', url: '#' },
        { title: 'استاد جامعة الملك سعود', desc: 'سعة 25,000 مقعد', url: '#' }
    ],
    2: [
        { title: 'مشروع النور السكني', desc: '40 فيلا سكنية', url: '#' },
        { title: 'مشروع الضاحية الخضراء', desc: '35 وحدة سكنية', url: '#' },
        { title: 'مشروع الواحة السكني', desc: '28 فيلا فاخرة', url: '#' }
    ],
    3: [
        { title: 'محطة تحلية المياه', desc: 'سعة 250,000 م³/يوم', url: '#' },
        { title: 'محطة معالجة الصرف الصحي', desc: 'سعة 150,000 م³/يوم', url: '#' },
        { title: 'خزان المياه الرئيسي', desc: 'سعة 100,000 م³', url: '#' }
    ],
    4: [
        { title: 'مجمع المدارس الدولية', desc: '10 مبانٍ تعليمية', url: '#' },
        { title: 'حرم الجامعة الجديد', desc: '15 مبنى أكاديمي', url: '#' },
        { title: 'مركز التدريب المهني', desc: '8 ورش تدريبية', url: '#' }
    ],
    5: [
        { title: 'مدارس النخبة الدولية', desc: '6 مجمعات مدرسية', url: '#' },
        { title: 'أكاديمية التميز التعليمية', desc: '4 حرم جامعي', url: '#' },
        { title: 'مركز التعليم المتقدم', desc: '12 قاعة محاضرات', url: '#' }
    ]
};

// Initialize project modal
function initializeProjectModal() {
    const projectCards = document.querySelectorAll('.project-card');
    const modalClose = document.getElementById('modalClose');
    
    // Add click event to project cards
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project');
            if (projectId) openProjectModal(projectId);
        });
    });
    
    // Close modal events
    if (modalClose) {
        modalClose.addEventListener('click', closeProjectModal);
    }
    
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeProjectModal();
            }
        });
    }
    
    // Close modal with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
            closeProjectModal();
        }
    });
}

// ============================================
// Initialize on DOM Ready
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    setupGalleries();
    initializeProjectModal();
});

