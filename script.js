document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navList.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navList.classList.remove('active');
        });
    });

    // Smooth Scrolling & Active Link
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            const mainContainer = document.querySelector('main');

            if (targetElement && mainContainer) {
                // Calculate position relative to the main container
                const elementPosition = targetElement.offsetTop;

                mainContainer.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Floating Sections
    const observerOptions = {
        threshold: 0.3, // Trigger when 30% visible
        root: document.querySelector('main') // Observe within main scroll container
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Trigger staggered animations for children
                const children = entry.target.querySelectorAll('.fade-in-up, .tilt-card, .accordion-item, .gallery-container, .contact-container');
                children.forEach((child, index) => {
                    child.style.animationDelay = `${index * 0.1}s`;
                    child.classList.add('animate-in');
                });
            } else {
                entry.target.classList.remove('visible'); // Fade out when leaving
                // Reset animations
                const children = entry.target.querySelectorAll('.animate-in');
                children.forEach(child => {
                    child.classList.remove('animate-in');
                    child.style.animationDelay = '0s';
                });
            }
        });
    }, observerOptions);

    // Observe all sections including hero
    document.querySelectorAll('.section, .hero').forEach(el => {
        observer.observe(el);
    });

    // Remove old fade-in-up logic as it's now handled by section visibility
    // document.querySelectorAll('.fade-in-up').forEach(el => { ... });

    // 3D Tilt Effect for Cards
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // Dynamic Circuit Sparks
    const circuitBg = document.querySelector('.circuit-bg');

    function createSpark() {
        const spark = document.createElement('div');
        spark.classList.add('spark');

        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        spark.style.left = `${x}%`;
        spark.style.top = `${y}%`;

        // Random animation duration
        const duration = 2 + Math.random() * 3;
        spark.style.animationDuration = `${duration}s`;

        circuitBg.appendChild(spark);

        // Remove after animation
        setTimeout(() => {
            spark.remove();
        }, duration * 1000);
    }

    // Create sparks periodically
    setInterval(createSpark, 500);

    // Gallery Scroll with Centered Carousel Effect
    const galleryScroll = document.querySelector('.gallery-scroll');
    const leftArrow = document.querySelector('.gallery-arrow.left');
    const rightArrow = document.querySelector('.gallery-arrow.right');

    if (galleryScroll && leftArrow && rightArrow) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        let currentIndex = 0;

        // Function to update centered item
        function updateCenteredItem() {
            const scrollLeft = galleryScroll.scrollLeft;
            const containerCenter = scrollLeft + galleryScroll.clientWidth / 2;

            galleryItems.forEach((item, index) => {
                const itemCenter = item.offsetLeft + item.clientWidth / 2;
                const distance = Math.abs(containerCenter - itemCenter);

                if (distance < item.clientWidth / 2) {
                    item.classList.add('center');
                    currentIndex = index;
                } else {
                    item.classList.remove('center');
                }
            });
        }

        // Function to scroll to specific item
        function scrollToItem(index) {
            if (index >= 0 && index < galleryItems.length) {
                const item = galleryItems[index];
                const scrollPosition = item.offsetLeft - (galleryScroll.clientWidth / 2) + (item.clientWidth / 2);

                galleryScroll.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
            }
        }

        leftArrow.addEventListener('click', () => {
            const newIndex = Math.max(0, currentIndex - 1);
            scrollToItem(newIndex);
        });

        rightArrow.addEventListener('click', () => {
            const newIndex = Math.min(galleryItems.length - 1, currentIndex + 1);
            scrollToItem(newIndex);
        });

        // Update on scroll
        galleryScroll.addEventListener('scroll', updateCenteredItem);

        // Initialize
        updateCenteredItem();
    }

    // Accordion Logic - Only one open at a time per level
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function (e) {
            // Prevent event bubbling to parent accordions
            e.stopPropagation();

            const accordionItem = this.parentElement;
            const isCurrentlyActive = accordionItem.classList.contains('active');

            // Find the parent accordion container (to close siblings at the same level)
            const parentAccordion = accordionItem.parentElement;
            const siblings = parentAccordion.querySelectorAll(':scope > .accordion-item');

            // Close all siblings at the same level
            siblings.forEach(sibling => {
                if (sibling !== accordionItem) {
                    sibling.classList.remove('active');
                }
            });

            // Toggle current item (if it was active, close it; if not, open it)
            if (isCurrentlyActive) {
                accordionItem.classList.remove('active');
            } else {
                accordionItem.classList.add('active');
            }
        });
    });

    // Click outside to close accordions
    document.addEventListener('click', (e) => {
        const activeItems = document.querySelectorAll('.accordion-item.active');
        activeItems.forEach(item => {
            // Check if the click is outside the active item
            if (!item.contains(e.target)) {
                item.classList.remove('active');
            }
        });
    });
});
