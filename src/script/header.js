/**
 * @module HamburgerMenu
 * @description Initializes and manages the responsive hamburger navigation menu.
 * Handles opening, closing, keyboard accessibility (Escape key), and clicking outside
 * the menu to dismiss it.
 */

export default function () {
    // Select required DOM elements based on updated BEM classes
    const hamBtn = document.querySelector('.header__ham-btn');
    const closeBtn = document.querySelector('.header__drawer-close');
    const hamMenu = document.querySelector('.header__drawer');

    // Guard clause: Prevent script errors if the elements don't exist on the current page
    if (!hamBtn || !closeBtn || !hamMenu) {
        return;
    }

    // Closes the hamburger menu by removing active utility classes.
    const closeMenu = () => {
        hamMenu.classList.remove('js-active');
        hamBtn.classList.remove('js-active');
    };

    // Open menu on hamburger button click
    hamBtn.addEventListener('click', () => {
        hamMenu.classList.add('js-active');
        hamBtn.classList.add('js-active');
    });

    // Close menu on close button click
    closeBtn.addEventListener('click', closeMenu);

    // Accessibility: Close the menu when the 'Escape' key is pressed
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hamMenu.classList.contains('js-active')) {
            closeMenu();
        }
    });

    // Click Outside: Close the menu if a click occurs outside the menu panel and the trigger button
    document.addEventListener('click', (e) => {
        if (
            hamMenu.classList.contains('js-active') &&
            !hamMenu.contains(e.target) &&
            !hamBtn.contains(e.target)
        ) {
            closeMenu();
        }
    });
}
