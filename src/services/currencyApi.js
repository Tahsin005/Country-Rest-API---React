let cachedRates = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const currencyApi = {
  getRates: async () => {
    const now = Date.now();
    if (cachedRates && now - lastFetchTime < CACHE_DURATION) {
      return cachedRates;
    }

    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('Exchange rate fetch failed');
      const data = await res.json();
      if (data.rates) {
        cachedRates = data.rates;
        lastFetchTime = now;
        return data.rates;
      }
    } catch (err) {
      console.warn('Failed to load live exchange rates, using fallback:', err);
    }

    // Fallback baseline rates relative to 1 USD
    return cachedRates || {
      USD: 1,
      EUR: 0.92,
      GBP: 0.78,
      JPY: 155.5,
      CAD: 1.36,
      AUD: 1.51,
      CHF: 0.90,
      CNY: 7.23,
      INR: 83.4,
    };
  },

  convert: (amount, fromCode, toCode, rates) => {
    if (!rates || !amount) return null;
    const rateFrom = rates[fromCode?.toUpperCase()];
    const rateTo = rates[toCode?.toUpperCase()];

    if (!rateFrom || !rateTo) return null;

    // Convert from -> USD -> to
    const inUsd = Number(amount) / rateFrom;
    const converted = inUsd * rateTo;
    return converted;
  },
};
