/**
 * @module specialDealsService
 * @description Manages API fetching and IndexedDB storage for special deals.
 */
import { API_URL } from '../constants/index.constansts.js';
/**
 * Initializes and upgrades the IndexedDB instance.
 * @returns {Promise<IDBDatabase>}
 */
const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('SpecialDealsDB', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('won_deals')) {
                db.createObjectStore('won_deals', { keyPath: 'promoCode' });
            }
            if (!db.objectStoreNames.contains('api_cache')) {
                db.createObjectStore('api_cache', { keyPath: 'id' });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

/**
 * Caches the fetched deals array into IndexedDB with a timestamp.
 * @param {Array} dealsArray - The array of deals fetched from the API.
 * @returns {Promise<void>}
 */
const cacheApiDeals = async (dealsArray) => {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('api_cache', 'readwrite');
        const store = transaction.objectStore('api_cache');

        const payload = {
            id: 'master_list',
            data: dealsArray,
            timestamp: Date.now(),
        };

        const request = store.put(payload);
        db.close();
        request.onsuccess = () => {
            resolve();
        };
        request.onerror = () => {
            reject(request.error);
        };
    });
};

/**
 * Retrieves cached deals if they exist and are under 12 hours old.
 * @returns {Promise<Array|null>} Array of deals, or null if expired/missing.
 */
const getCachedApiDeals = async () => {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('api_cache', 'readwrite');
        const store = transaction.objectStore('api_cache');
        const request = store.get('master_list');

        request.onsuccess = () => {
            const record = request.result;
            if (!record) return resolve(null);

            // 12-hour expiration limit
            const age = Date.now() - record.timestamp;
            const CACHE_EXPIRATION_DURATION = 1000 * 60 * 60 * 12;

            if (age > CACHE_EXPIRATION_DURATION) {
                store.clear();
                db.close();
                resolve(null);
            } else {
                db.close();
                resolve(record.data);
            }
        };
        request.onerror = () => reject(request.error);
    });
};

/**
 * Retrieves the array of deals the user has already won.
 * @returns {Promise<Array>}
 */
const getUserWonDeals = async () => {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('won_deals', 'readonly');
        const store = transaction.objectStore('won_deals');
        const request = store.getAll();

        db.close();
        request.onsuccess = () => {
            resolve(request.result || []);
        };
        request.onerror = () => {
            reject(request.error);
        };
    });
};

/**
 * Saves a newly won deal into the user's IndexedDB history.
 * @param {Object} wonDealObject - The deal object won by the user.
 * @returns {Promise<void>}
 */
const setUserWonDeal = async (wonDealObject) => {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('won_deals', 'readwrite');
        const store = transaction.objectStore('won_deals');

        const request = store.put(wonDealObject);

        db.close();
        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
};

/**
 * Fetches all available deals, preferring the cache fallback to network.
 * @returns {Promise<Array>}
 */
const getAllDeals = async () => {
    try {
        const cachedDeals = await getCachedApiDeals();

        if (cachedDeals) {
            return cachedDeals;
        }

        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const fetchedDeals = await response.json();
        await cacheApiDeals(fetchedDeals);

        return fetchedDeals;
    } catch {
        return [];
    }
};

export { getUserWonDeals, setUserWonDeal, getAllDeals };
