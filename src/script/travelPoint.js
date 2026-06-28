/**
 * @module TravelPointSection
 * @description Initializes and displays the company data details cards and formats metric values.
 */

/**
 * Initializes the travel point section metrics display.
 * @returns {void}
 */
const travelPointInit = async () => {
    /**
     * Formats numeric values into shorthand strings (e.g., k+, l+, cr+).
     * @param {number} value
     * @returns {string} shorthand strings
     */
    const formatMetricValue = (value) => {
        if (value < 100) return value.toString();

        const placeValuePower = Math.floor(Math.log10(value));
        const factor = Math.pow(10, placeValuePower);
        const floorValue = Math.floor(value / factor) * factor;

        if (floorValue >= 10000000) {
            return `${floorValue / 10000000}cr+`;
        } else if (floorValue >= 100000) {
            return `${floorValue / 100000}l+`;
        } else if (floorValue >= 1000) {
            return `${floorValue / 1000}k+`;
        }

        return `${floorValue}+`;
    };

    /**
     * Generates and appends metric cards to the DOM.
     * @param {Object} data
     * @returns {void}
     */
    const cardContainer = document.querySelector(
        '.travel-point-section__company-details',
    );

    const displayCompanyTravelData = (data) => {
        if (!cardContainer) return;

        for (const key in data) {
            const card = document.createElement('div');
            card.classList.add('travel-point-section__card');

            card.innerHTML = `
                <h2>${formatMetricValue(data[key])}</h2>
                <p>${key}</p>
            `;

            cardContainer.appendChild(card);
        }
    };

    try {
        const response = await fetch('../../public/data/travelPoint.json');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const companyTravelData = await response.json();
        displayCompanyTravelData(companyTravelData);
    } catch {
        cardContainer.innerHTML = `
                <p>
                    Metrics are temporarily unavailable.
                </p>
            `;
    }
};

export { travelPointInit };
