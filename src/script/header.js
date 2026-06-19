export default function () {
    const hamBtn = document.querySelector('.header-ham-btn');
    const closeBtn = document.querySelector('.ham-menu-close');
    const hamMenu = document.querySelector('.header-ham-menu');

    hamBtn.addEventListener('click', () => {
        hamMenu.classList.add('active');
        hamBtn.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        hamMenu.classList.remove('active');
        hamBtn.classList.remove('active');
    });
}
