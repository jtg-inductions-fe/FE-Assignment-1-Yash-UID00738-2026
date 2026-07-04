/**
 * @module specialDealsModal
 * @description processes user won deals & all deals and activates spin and win component
 */

import {
    getUserWonDeals,
    setUserWonDeal,
    getAllDeals,
} from './utils/specialDealsService.js';

/**
 * Initializes the special deals module, fetching data and setting up the UI state.
 * @returns {Promise<void>}
 */
const specialDealsInit = async () => {
    const allDeals = await getAllDeals();
    let userWonDeals = await getUserWonDeals();
    let currentWheelDeals = [];

    /**
     * Controls winner selection and spinning of wheel
     * @returns {Function}
     */
    const spinHandler = () => {
        let isSpinning = false;
        let currentRotation = 0;
        const LANDING_ANGLES = [45, 315, 135, 225];

        return (spinWheel) => {
            if (isSpinning) return;
            isSpinning = true;

            const winnerID = Math.floor(Math.random() * 4);
            const targetAngle = LANDING_ANGLES[winnerID];
            const currentMod = currentRotation % 360;

            let degreesToTarget = targetAngle - currentMod;

            if (degreesToTarget < 0) {
                degreesToTarget += 360;
            }

            const extraSpins = 360 * 4;
            currentRotation += extraSpins + degreesToTarget;

            spinWheel.style.transform = `rotate(${currentRotation}deg)`;

            return new Promise((resolve) => {
                setTimeout(() => {
                    isSpinning = false;
                    resolve(winnerID);
                }, 4000);
            });
        };
    };

    const spinWheelExecutor = spinHandler();

    /**
     * Manages the attachment and detachment of the spin button event listener.
     * @type {Object}
     */
    const spinEventManager = {
        activeListener: null,

        add() {
            const spinBtn = document.getElementById('spinBtn');
            const spinWheel = document.getElementById('spinWheel');

            this.remove();

            this.activeListener = async () => {
                spinBtn.disabled = true;

                let winnerId = await spinWheelExecutor(spinWheel);
                const baseDeal = currentWheelDeals[winnerId];

                if (baseDeal) {
                    const wonDeal = {
                        ...baseDeal,
                        wonAt: Date.now(),
                    };
                    userWonDeals.push(wonDeal);
                    setUserWonDeal(wonDeal);
                    displayWonDeal(wonDeal);
                    updateUnlockedDealsBadge();

                    replaceWonDeal(winnerId);
                    updateUI();
                }

                spinBtn.disabled = false;
            };

            spinBtn.addEventListener('click', this.activeListener);
        },

        remove() {
            const spinBtn = document.getElementById('spinBtn');
            if (this.activeListener && spinBtn) {
                spinBtn.removeEventListener('click', this.activeListener);
                this.activeListener = null;
            }
        },
    };

    /**
     * Generates the DOM element for a deal card.
     * @param {Object} wonDealObject - The deal data.
     * @returns {HTMLElement} The created deal card element.
     */
    const generateDealCardHTML = (wonDealObject) => {
        const validDays = wonDealObject.validFor ? wonDealObject.validFor : 7;

        const wonAt = wonDealObject.wonAt || Date.now();

        const expiryTimestamp = wonAt + validDays * 24 * 60 * 60 * 1000;
        const isExpired = Date.now() > expiryTimestamp;

        const modifierClass = isExpired
            ? 'deal-card--disabled'
            : 'deal-card--active';

        let expiryText;
        if (isExpired) {
            expiryText = 'Expired';
        } else {
            const daysLeft = Math.ceil(
                (expiryTimestamp - Date.now()) / (24 * 60 * 60 * 1000),
            );
            expiryText = `Expires in ${daysLeft}d`;
        }

        const wonDealCard = document.createElement('div');

        wonDealCard.classList.add('deal-card', modifierClass);

        wonDealCard.innerHTML = `
                <div class="deal-card__info-container">
                    <h2 class="heading-sm">${wonDealObject.label}</h2>
                    <h3 class="subheading-sm">${expiryText}</h3>
                </div>
                <div class="deal-card__promo-copy-container">
                    <div class="deal-card__promo-code-container">
                        <h2 class="text-promo">${wonDealObject.promoCode}</h2>
                    </div>
                    <button class="copy-btn" type="button" aria-label="copy-btn" data-action="copy" ${isExpired ? 'disabled' : ''}>
                        <img src="./src/assets/images/copy-icon.svg" aria-hidden="true" width="24" height="24" class="copy-btn-icon">
                    </button>
                </div>
        `;
        return wonDealCard;
    };

    /**
     * Displays the most recently won deal in the UI.
     * @param {Object} wonDealObject - The deal data to display.
     * @returns {void}
     */
    const displayWonDeal = (wonDealObject) => {
        const wonDealContainer = document.querySelector(
            '.spin-and-win-component__won-deal',
        );
        wonDealContainer.classList.add('won-deal--active');

        const card = generateDealCardHTML(wonDealObject);
        wonDealContainer.innerHTML = `<h2 class="won-deal__heading">you won!</h2>`;
        wonDealContainer.appendChild(card);
    };

    /**
     * Updates the UI badge displaying the total count of unlocked deals.
     * @returns {void}
     */
    const updateUnlockedDealsBadge = () => {
        const unlockedDealsBadge = document.querySelector(
            '.view-unlocked-deals-btn__badge',
        );
        if (unlockedDealsBadge) {
            unlockedDealsBadge.textContent = userWonDeals.length;
        }
    };

    /**
     * Renders all unlocked deals in the gallery view using a DocumentFragment.
     * @param {Array} userWonDeals - The array of user's won deals.
     * @returns {void}
     */
    const displayUnlockedDeals = (userWonDeals) => {
        const dealsContainer = document.querySelector(
            '.unlocked-deals-component__deals-container',
        );

        dealsContainer.innerHTML = '';

        const fragment = document.createDocumentFragment();

        for (let wonDealObject of userWonDeals) {
            let card = generateDealCardHTML(wonDealObject);
            fragment.appendChild(card);
        }

        dealsContainer.appendChild(fragment);
    };

    /**
     * Filters and returns random deals that the user hasn't won AND aren't currently on the wheel.
     * @param {Number} numberOfDealsRequired
     * @returns {Array}
     */
    const getRandomAvailableDeals = (numberOfDealsRequired) => {
        const wonCodes = userWonDeals.map((deal) => deal.promoCode);

        const displayedCodes = currentWheelDeals
            .filter((deal) => deal !== null)
            .map((deal) => deal.promoCode);

        const codesToExclude = [...wonCodes, ...displayedCodes];

        const availableDeals = allDeals.filter(
            (deal) => !codesToExclude.includes(deal.promoCode),
        );

        const shuffledDeals = availableDeals.sort(() => 0.5 - Math.random());
        return shuffledDeals.slice(0, numberOfDealsRequired);
    };

    /**
     * Replaces a won deal in the centralized state
     * @param {Number} winnerID
     */
    const replaceWonDeal = (winnerID) => {
        const newDealArray = getRandomAvailableDeals(1);

        if (newDealArray.length > 0) {
            currentWheelDeals[winnerID] = newDealArray[0];
        } else {
            currentWheelDeals[winnerID] = null;
        }
    };

    /**
     * Injects the centralized state into the DOM
     * @returns {void}
     */
    const updateUI = () => {
        const segment1 = document.querySelector('.wheel__segment--1');
        const segment2 = document.querySelector('.wheel__segment--2');
        const segment3 = document.querySelector('.wheel__segment--3');
        const segment4 = document.querySelector('.wheel__segment--4');

        segment1.innerHTML = `<h2>${currentWheelDeals[0]?.label || 'Try Again'}</h2>`;
        segment2.innerHTML = `<h2>${currentWheelDeals[1]?.label || 'Try Again'}</h2>`;
        segment3.innerHTML = `<h2>${currentWheelDeals[2]?.label || 'Try Again'}</h2>`;
        segment4.innerHTML = `<h2>${currentWheelDeals[3]?.label || 'Try Again'}</h2>`;
    };

    /**
     * controls calling of functions on open
     * @returns {void}
     */
    const specialDealsHandler = () => {
        currentWheelDeals = getRandomAvailableDeals(4);

        while (currentWheelDeals.length < 4) {
            currentWheelDeals.push(null);
        }

        updateUI();
        spinEventManager.add();
    };

    /**
     * Handles the opening and closing of the Special Deals Modal
     * @returns {void}
     */
    const setupModalListeners = () => {
        const navLink = document.querySelector('a[href="#special-deals"]');
        const dealsModal = document.querySelector('.deals-modal');
        const wheel = document.querySelector('.wheel');

        const spinAndWinComponent = document.querySelector(
            '.spin-and-win-component',
        );
        const unlockedDealsComponent = document.querySelector(
            '.unlocked-deals-component',
        );

        if (navLink) {
            navLink.addEventListener('click', (event) => {
                event.preventDefault();
                dealsModal.classList.add('is-open');
                wheel.classList.add('wheel--active');
                specialDealsHandler();
            });
        }

        // ==========================================
        // Handles all clicks inside the modal using data-action
        // ==========================================
        if (dealsModal) {
            dealsModal.addEventListener('click', async (event) => {
                const actionElement = event.target.closest('[data-action]');

                if (!actionElement) return;

                const action = actionElement.getAttribute('data-action');
                /* eslint-disable indent */
                switch (action) {
                    case 'close':
                        dealsModal.classList.remove('is-open');
                        wheel.classList.remove('wheel--active');
                        spinEventManager.remove();
                        break;

                    case 'view-unlocked':
                        spinAndWinComponent.classList.remove(
                            'spin-and-win-component--active',
                        );
                        unlockedDealsComponent.classList.add(
                            'unlocked-deals-component--active',
                        );
                        displayUnlockedDeals(userWonDeals);
                        break;

                    case 'go-back':
                        spinAndWinComponent.classList.add(
                            'spin-and-win-component--active',
                        );
                        unlockedDealsComponent.classList.remove(
                            'unlocked-deals-component--active',
                        );
                        break;

                    case 'copy': {
                        const card = actionElement.closest('.deal-card');
                        const promoCodeText =
                            card.querySelector('.text-promo').textContent;

                        try {
                            await navigator.clipboard.writeText(promoCodeText);

                            const icon =
                                actionElement.querySelector('.copy-btn-icon');
                            icon.style.opacity = '0.3';
                            setTimeout(() => {
                                icon.style.opacity = '1';
                            }, 500);
                        } catch {
                            // Suppress clipboard errors
                        }
                        break;
                    }
                }
            });
        }
    };

    setupModalListeners();
    updateUnlockedDealsBadge();
};

export { specialDealsInit };
