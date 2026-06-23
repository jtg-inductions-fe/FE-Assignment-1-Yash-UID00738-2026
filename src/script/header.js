export default function () {
    const hamBtn = document.querySelector('.header-ham-btn');
    const closeBtn = document.querySelector('.ham-menu-close');
    const hamMenu = document.querySelector('.header-ham-menu');

    if (!hamBtn || !closeBtn || !hamMenu) {
        alert('Header elements not found. Skipping menu initialization.');
        return;
    }

    function closeMenu() {
        hamMenu.classList.remove('active');
        hamBtn.classList.remove('active');
    }

    hamBtn.addEventListener('click', () => {
        hamMenu.classList.add('active');
        hamBtn.classList.add('active');
    });

    closeBtn.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hamMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    document.addEventListener('click', (e) => {
        if (
            hamMenu.classList.contains('active') &&
            !hamMenu.contains(e.target) &&
            !hamBtn.contains(e.target)
        ) {
            closeMenu();
        }
    });
}
