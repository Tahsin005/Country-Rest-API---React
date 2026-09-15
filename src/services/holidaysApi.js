const holidaysCache = new Map();

export const holidaysApi = {
  getUpcomingHolidays: async (alpha2Code) => {
    if (!alpha2Code || alpha2Code.length !== 2) return [];
    const code = alpha2Code.toUpperCase();
    const currentYear = new Date().getFullYear();
    const cacheKey = `${code}_${currentYear}`;

    if (holidaysCache.has(cacheKey)) {
      return holidaysCache.get(cacheKey);
    }

    try {
      const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/${code}`);
      if (!res.ok) return [];
      const data = await res.json();

      if (!Array.isArray(data)) return [];

      const todayStr = new Date().toISOString().split('T')[0];
      const sorted = data.sort((a, b) => a.date.localeCompare(b.date));

      // Separate upcoming and past
      const upcoming = sorted.filter((h) => h.date >= todayStr);
      const past = sorted.filter((h) => h.date < todayStr);
      const result = upcoming.length > 0 ? upcoming : past.slice(-5);

      holidaysCache.set(cacheKey, result);
      return result;
    } catch (err) {
      console.warn('Public holidays fetch failed:', err);
      return [];
    }
  },
};
