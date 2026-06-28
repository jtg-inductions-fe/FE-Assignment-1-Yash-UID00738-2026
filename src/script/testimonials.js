import Splide from '@splidejs/splide';
import '@splidejs/splide/css';

const testimonialsInit = async () => {
    const splideList = document.querySelector('.splide__list');
    const testimonialsSection = document.querySelector('.testimonials-section');

    // Guard clause: stop execution if the element isn't on the page
    if (!splideList) return;

    try {
        const response = await fetch('./public/data/testimonials.json');

        if (!response.ok) throw new Error('Network response was not ok');

        const testimonials = await response.json();

        const slidesHTML = testimonials
            .map(
                (data) => `
            <li class="splide__slide testimonials-section__slide">
                <div class="testimonials-section__card">
                    <div class="testimonials-section__avatar-container">
                        <img
                            class="testimonials-section__avatar"
                            src="${data.avatar}"
                            alt="${data.name}"
                            width="100"
                            height="100"
                        />
                    </div>

                    <div class="testimonials-section__author">
                        <div class="testimonials-section__author-details">
                            <span class="testimonials-section__name">${data.name}&nbsp;</span>
                            <span class="testimonials-section__role">/&nbsp;${data.role}</span>
                        </div>

                        <div class="testimonials-section__stars">
                            ${`
                            <img
                                src="../../public/assets/images/star.svg"
                                alt=""
                                aria-hidden="true"
                                class="testimonials-section__stars-icon"
                                width="25"
                                height="25"
                            />
                            `.repeat(data.rating)}
                        </div>
                    </div>

                    <p class="testimonials-section__review-text">
                        ${data.text}
                    </p>
                </div>
            </li>
        `,
            )
            .join('');

        splideList.innerHTML = slidesHTML;

        new Splide('.splide', {
            type: 'loop',
            perPage: 1,
            pagination: true,
            arrows: true,
        }).mount();
    } catch {
        testimonialsSection.innerHTML =
            '<p style="text-align: center;">Unable to load testimonials at this time.</p>';
    }
};

export { testimonialsInit };
