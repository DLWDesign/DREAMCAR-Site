document.addEventListener('DOMContentLoaded', () => {
    const curtainContainer = document.getElementById('curtain-container');
    const mainContentWrapper = document.getElementById('main-content-wrapper');

    if (curtainContainer && mainContentWrapper) {
        // Trigger the curtain animation
        curtainContainer.classList.add('animate');

        // After the animation, hide the curtain and show the main content
        setTimeout(() => {
            curtainContainer.style.display = 'none';
            mainContentWrapper.classList.remove('hidden'); // Show main content
        }, 1500); // Matches CSS transition duration (1s for transform + 0.5s for logo fade-out delay)
    }

    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const header = document.querySelector('.header');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            header.classList.toggle('nav-open');
        });
    }

    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop) {
            // Downscroll
            header.style.top = "-80px"; // Assuming header height is 80px
        } else {
            // Upscroll
            header.style.top = "0";
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    });

    const fadeInSections = document.querySelectorAll('.fade-in-section');

    const revealSection = () => {
        const windowHeight = window.innerHeight;
        fadeInSections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < windowHeight - 100) {
                section.classList.add('is-visible');
            }
        });
    };

    window.addEventListener('scroll', revealSection);
    revealSection(); // Initial check
});