/* ==================== Carousel ==================== */
(function initCarousel() {
    const carousel = document.getElementById('carousel');
    const dotsContainer = document.getElementById('dots');
    if (!carousel || !dotsContainer) return;

    const images = carousel.querySelectorAll('img');
    let currentIndex = 0;

    // إنشاء النقط
    images.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');

        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function goToSlide(index) {
        currentIndex = index;
        const slideWidth = carousel.offsetWidth;

        // مهم جداً في الـ RTL
        carousel.scrollTo({
            left: slideWidth * index,
            behavior: 'smooth'
        });

        updateDots();
    }

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // الحل الأساسي لمشكلة الـ RTL
    carousel.addEventListener('scroll', () => {
        const slideWidth = carousel.offsetWidth;
        const scrollLeft = Math.abs(carousel.scrollLeft);
        const newIndex = Math.round(scrollLeft / slideWidth);

        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
            currentIndex = newIndex;
            updateDots();
        }
    });
})();