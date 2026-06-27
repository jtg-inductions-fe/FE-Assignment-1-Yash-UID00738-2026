import Splide from '@splidejs/splide';
import '@splidejs/splide/css';

const testimonialsInit = () => {
    const splideInit = () => {
        new Splide('.splide').mount();
    };

    splideInit();
};

export { testimonialsInit };
