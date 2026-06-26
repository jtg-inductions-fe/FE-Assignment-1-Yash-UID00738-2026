/**
 * @module HamburgerMenu
 * @description Initializes and manages the responsive hamburger navigation menu.
 * Handles opening, closing, keyboard accessibility (Escape key), and clicking outside
 * the menu to dismiss it.
 */

export default function () {
    const hamBtn = document.querySelector('.header__ham-btn');
    const closeBtn = document.querySelector('.header__drawer-close');
    const hamMenu = document.querySelector('.header__drawer');
    const header = document.querySelector('.header');
    const navMenu = document.querySelector('.nav-menu');

    if (!hamBtn || !closeBtn || !hamMenu || !header || !navMenu) return;

    function closeMenu() {
        hamMenu.classList.remove('js-active');
        hamBtn.classList.remove('js-active');
    }

    // Dynamic Teleportation logic based on viewport width
    function handleNavigationResponsiveLayout() {
        const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

        if (isDesktop) {
            // Always ensure the desktop modifier class is present on desktop viewports
            navMenu.classList.add('nav-menu--desktop');

            // Move it to the header if it isn't already there
            if (navMenu.parentNode !== header) {
                header.insertBefore(
                    navMenu,
                    header.querySelector('.header__btn-container'),
                );
                closeMenu();
            }
        } else {
            // Remove the desktop modifier class on mobile/tablet viewports
            navMenu.classList.remove('nav-menu--desktop');

            // Move it into the drawer side panel if it isn't already there
            if (navMenu.parentNode !== hamMenu) {
                hamMenu.insertBefore(navMenu, closeBtn);
            }
        }
    }
    // Event Listeners
    hamBtn.addEventListener('click', () => {
        hamMenu.classList.add('js-active');
        hamBtn.classList.add('js-active');
    });

    closeBtn.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hamMenu.classList.contains('js-active'))
            closeMenu();
    });

    document.addEventListener('click', (e) => {
        if (
            hamMenu.classList.contains('js-active') &&
            !hamMenu.contains(e.target) &&
            !hamBtn.contains(e.target)
        ) {
            closeMenu();
        }
    });

    // Run adjustments on window resize and initial execution
    window.addEventListener('resize', handleNavigationResponsiveLayout);
    handleNavigationResponsiveLayout();
}
