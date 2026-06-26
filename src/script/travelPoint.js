/**
 * @module TravelPointSection
 * @description Initializes and displays the company mata details cards and formats metric values.
 */

export default function () {
    const companyTravelData = {
        'Holiday Package': 501,
        'Luxury Hotel': 100,
        'Premium Airlines': 7,
        'Happy Customer': 2001,
    };

    const formatMetricValue = (value) => {
        if (value < 100) return value.toString();

        // Find the magnitude power (number of digits minus 1)
        const placeValuePower = Math.floor(Math.log10(value));
        const factor = Math.pow(10, placeValuePower);

        // Round completely down to the leading digit
        const floorValue = Math.floor(value / factor) * factor;

        // Match the rounded value to the correct shorthand suffix rule
        if (floorValue >= 10000000) {
            return `${floorValue / 10000000}cr+`;
        } else if (floorValue >= 100000) {
            return `${floorValue / 100000}l+`;
        } else if (floorValue >= 1000) {
            return `${floorValue / 1000}k+`;
        }

        return `${floorValue}+`;
    };

    const displayCompanyTravelData = (companyTravelData) => {
        const cardContainer = document.querySelector(
            '.travel-point-section__company-details',
        );

        if (!cardContainer) return; // Guard clause safety check

        for (const key in companyTravelData) {
            const card = document.createElement('div');

            card.classList.add('travel-point-section__card');

            card.innerHTML = `
                <h2>${formatMetricValue(companyTravelData[key])}</h2>
                <p>${key}</p>
            `;

            cardContainer.appendChild(card);
        }
    };

    displayCompanyTravelData(companyTravelData);
}
