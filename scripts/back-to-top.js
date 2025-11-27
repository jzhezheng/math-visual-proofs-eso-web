document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    backToTopButton.setAttribute('title', 'Back to top');

    backToTopButton.innerHTML = `
        <svg class="back-to-top-progress" viewBox="0 0 60 60">
            <circle class="back-to-top-progress-bg" cx="30" cy="30" r="25"/>
            <circle class="back-to-top-progress-fill" cx="30" cy="30" r="25"/>
        </svg>
        <svg class="back-to-top-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
        </svg>
    `;

    document.body.appendChild(backToTopButton);

    const progressFill = backToTopButton.querySelector('.back-to-top-progress-fill');
    const circumference = 2 * Math.PI * 25;

    progressFill.style.strokeDasharray = circumference;
    progressFill.style.strokeDashoffset = circumference;

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function updateBackToTop() {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = Math.min(scrollY / docHeight, 1);

        const progressOffset = circumference - (scrollProgress * circumference);
        progressFill.style.strokeDashoffset = progressOffset;

        if (scrollY > 10) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }

    const debouncedUpdate = debounce(updateBackToTop, 10);

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);

        setTimeout(() => {
            if (typeof updateActiveNav === 'function') {
                updateActiveNav();
            }

            const sectionNavLinks = document.querySelectorAll('.section-nav-link');
            const firstNavLink = document.querySelector('.section-nav-link[href="#algebraic-identities"]');

            if (sectionNavLinks.length > 0 && firstNavLink) {
                sectionNavLinks.forEach(item => item.classList.remove('active'));
                firstNavLink.classList.add('active');

                const sidebarLinks = document.querySelectorAll('.sidebar-nav .submenu-link');
                sidebarLinks.forEach(link => link.classList.remove('active'));
                const firstSidebarLink = document.querySelector('.sidebar-nav .submenu-link[href="#algebraic-identities"]');
                if (firstSidebarLink) {
                    firstSidebarLink.classList.add('active');
                }
            }
        }, 300);
    });

    backToTopButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            setTimeout(() => {
                if (typeof updateActiveNav === 'function') {
                    updateActiveNav();
                }
            }, 300);
        }
    });

    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    });

    updateBackToTop();
});
