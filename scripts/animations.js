document.addEventListener('DOMContentLoaded', function() {
    function getScrollOffset() {
        const header = document.querySelector('.site-header');
        const nav = document.querySelector('.section-nav');
        return (header ? header.offsetHeight : 0) + (nav ? nav.offsetHeight : 0) + 20;
    }

    const sectionNavLinks = document.querySelectorAll('.section-nav-link');
    const sections = document.querySelectorAll('.animation-section');

    function updateActiveNav() {
        const scrollPosition = window.scrollY + getScrollOffset();
        let activeSection = null;
        let minDistance = Infinity;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.clientHeight;
            const sectionId = section.getAttribute('id');
            const sectionMiddle = sectionTop + (section.clientHeight / 2);
            const distance = Math.abs(scrollPosition - sectionMiddle);

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSection = sectionId;
                minDistance = 0;
            }
            else if (distance < minDistance && minDistance > 0) {
                activeSection = sectionId;
                minDistance = distance;
            }
        });

        if (!activeSection && sections.length > 0) {
            activeSection = sections[0].getAttribute('id');
        }

        if (activeSection) {
            sectionNavLinks.forEach(item => item.classList.remove('active'));
            const correspondingNav = document.querySelector(`.section-nav-link[href="#${activeSection}"]`);
            if (correspondingNav) {
                correspondingNav.classList.add('active');
            }
            updateSidebarActive(activeSection);
        }
    }

    function updateSidebarActive(activeSection) {
        const sidebarLinks = document.querySelectorAll('.sidebar-nav .submenu-link');
        sidebarLinks.forEach(link => link.classList.remove('active'));

        const activeSidebarLink = document.querySelector(`.sidebar-nav .submenu-link[href="#${activeSection}"]`);
        if (activeSidebarLink) {
            activeSidebarLink.classList.add('active');
        }
    }

    sectionNavLinks.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                sectionNavLinks.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                updateSidebarActive(targetId.substring(1));

                const offsetTop = targetSection.offsetTop - getScrollOffset();
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                history.pushState(null, null, targetId);
            }
        });
    });

    const videoContainers = document.querySelectorAll('.video-container');

    videoContainers.forEach(container => {
        container.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });

        container.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    const animationCards = document.querySelectorAll('.animation-card');

    animationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('section-nav-link')) {
                e.preventDefault();
                const currentIndex = Array.from(sectionNavLinks).indexOf(focusedElement);
                let nextIndex;

                if (e.key === 'ArrowDown') {
                    nextIndex = currentIndex < sectionNavLinks.length - 1 ? currentIndex + 1 : 0;
                } else {
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : sectionNavLinks.length - 1;
                }

                sectionNavLinks[nextIndex].focus();
            }
        }
    });

    animationCards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Mathematical proof ${index + 1}`);

        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    let scrollTimeout;
    window.addEventListener('scroll', function() {
        updateActiveNav();

        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        scrollTimeout = setTimeout(updateActiveNav, 50);
    });

    updateActiveNav();

    window.addEventListener('popstate', function() {
        const hash = window.location.hash;
        if (hash) {
            const targetSection = document.querySelector(hash);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - getScrollOffset();
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                setTimeout(updateActiveNav, 100);
            }
        }
    });

    const style = document.createElement('style');
    style.textContent = `
        @media print {
            .page-controls, .site-header, .sidebar-nav, .site-footer, .section-nav {
                display: none !important;
            }

            .animation-section {
                break-before: page;
            }

            .animation-card {
                break-inside: avoid;
                box-shadow: none !important;
                border: 2px solid #000 !important;
            }

            .animations-main {
                padding: 20px !important;
            }
        }
    `;
    document.head.appendChild(style);

    function initUniformCardHeights() {
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

        function uniformCardHeights() {
            const grids = document.querySelectorAll('.animation-grid');

            grids.forEach(grid => {
                const cards = Array.from(grid.querySelectorAll('.animation-card'));
                let maxHeight = 0;

                if (window.innerWidth < 768) {
                    cards.forEach(card => {
                        card.style.height = 'auto';
                    });
                    return;
                }

                cards.forEach(card => {
                    card.style.height = 'auto';
                    const cardHeight = card.offsetHeight;
                    if (cardHeight > maxHeight) {
                        maxHeight = cardHeight;
                    }
                });

                cards.forEach(card => {
                    card.style.height = maxHeight + 'px';
                });
            });
        }

        const debouncedUniformHeights = debounce(uniformCardHeights, 250);

        window.addEventListener('load', uniformCardHeights);
        window.addEventListener('resize', debouncedUniformHeights);

        setTimeout(uniformCardHeights, 100);
    }

    initUniformCardHeights();
});
