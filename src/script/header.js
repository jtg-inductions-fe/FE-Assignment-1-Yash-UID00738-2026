/**
 * @module HamburgerMenu
 * @description Initializes and manages the responsive hamburger navigation menu.
 * Handles opening, closing, keyboard accessibility (Escape key), and clicking outside
 * the menu to dismiss it safely.
 */

/**
 * Initializes the header and sets up event listeners.
 * @returns {void}
 */

const headerInit = function () {
    const hamBtn = document.querySelector('.header__ham-btn');
    const closeBtn = document.querySelector('.header__drawer-close');
    const hamMenu = document.querySelector('.header__drawer');
    const header = document.querySelector('.header');
    const navMenu = document.querySelector('.nav-menu');

    if (!hamBtn || !closeBtn || !hamMenu || !header || !navMenu) return;

    /**
     * Resets the toggle modifiers and closes out the navigation portal visibility window.
     * @returns {void}
     */

    function closeMenu() {
        hamMenu.classList.remove('js-active');
        hamBtn.classList.remove('js-active');
        hamBtn.setAttribute('aria-expanded', 'false');
    }

    hamBtn.addEventListener('click', () => {
        hamMenu.classList.add('js-active');
        hamBtn.classList.add('js-active');
        hamBtn.setAttribute('aria-expanded', 'true');
    });

    closeBtn.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hamMenu.classList.contains('js-active')) {
            closeMenu();
        }
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
};

export { headerInit };
