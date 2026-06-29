const footerInit = () => {
    // Select all the h3 elements
    const footerHeadings = document.querySelectorAll('.footer__subheading');

    footerHeadings.forEach((heading) => {
        heading.addEventListener('click', () => {
            // heading.nextElementSibling targets the <ul> right next to the <h3>
            const linkContainer = heading.nextElementSibling;

            // Target the dropdown span inside the clicked <h3>
            const span = heading.querySelector('.dropdown');

            if (span) {
                span.classList.toggle('rotate');
            }

            linkContainer.classList.toggle('accordion');
        });
    });
};

export { footerInit };
