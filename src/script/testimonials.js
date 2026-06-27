import Splide from '@splidejs/splide';
import '@splidejs/splide/css';

const testimonialsInit = () => {
    const splideInit = () => {
        new Splide('.splide', {
            type: 'loop', // Infinite scroll
            perPage: 1, // Show one testimonial at a time
            pagination: true, // Auto-generates the pagination dots at the bottom
        }).mount();
    };

    splideInit();
};

export { testimonialsInit };
