const BASE_URL = 'https://api.restcountries.com/countries/v5';
const API_TOKEN = import.meta.env.VITE_RESTCOUNTRIES_API_TOKEN || 'rc_live_6e4eae1a39b94b3e94ffd666122f47ef';

// In-memory cache
const memoryCache = new Map();

// Lazy load fallback countries from local JSON bundle or public folder
let fallbackDataPromise = null;
const loadFallbackCountries = async () => {
  if (!fallbackDataPromise) {
    fallbackDataPromise = (async () => {
      try {
        const module = await import('../data/countriesFallback.json');
        return module.default || module;
      } catch (err) {
        console.warn('Direct import of countriesFallback.json failed, fetching from /data:', err);
        const res = await fetch('/data/countriesFallback.json');
        return await res.json();
      }
    })();
  }
  return fallbackDataPromise;
};

const getFromStorage = (key) => {
  try {
    const item = sessionStorage.getItem(`atlas_cache_${key}`);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

const setToStorage = (key, data) => {
  try {
    sessionStorage.setItem(`atlas_cache_${key}`, JSON.stringify(data));
  } catch {
    // Storage quota might be reached or disabled
  }
};

const fetchWithToken = async (url) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });
  if (!response.ok) throw new Error(`API Request failed with status ${response.status}`);
  const data = await response.json();
  return data;
};

const fetchAllPaginated = async (baseUrl) => {
  let allObjects = [];
  let offset = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const separator = baseUrl.includes('?') ? '&' : '?';
    const data = await fetchWithToken(`${baseUrl}${separator}limit=${limit}&offset=${offset}`);

    if (data.data && data.data.objects) {
      allObjects = [...allObjects, ...data.data.objects];
    }

    if (data.data && data.data.meta && data.data.meta.more) {
      offset += limit;
    } else {
      hasMore = false;
    }
  }

  return allObjects;
};

export const countryApi = {
  getAll: async () => {
    const cacheKey = 'all_countries';
    if (memoryCache.has(cacheKey)) return memoryCache.get(cacheKey);

    const stored = getFromStorage(cacheKey);
    if (stored) {
      memoryCache.set(cacheKey, stored);
      return stored;
    }

    try {
      const data = await fetchAllPaginated(BASE_URL);
      if (Array.isArray(data) && data.length > 0) {
        memoryCache.set(cacheKey, data);
        setToStorage(cacheKey, data);
        return data;
      }
      throw new Error('Empty response from Rest Countries API');
    } catch (err) {
      console.warn('REST Countries API error or rate-limited. Falling back to local offline dataset:', err);
      const fallback = await loadFallbackCountries();
      memoryCache.set(cacheKey, fallback);
      return fallback;
    }
  },

  getByName: async (name) => {
    const cacheKey = `country_${name.toLowerCase()}`;
    if (memoryCache.has(cacheKey)) return memoryCache.get(cacheKey);

    const stored = getFromStorage(cacheKey);
    if (stored) {
      memoryCache.set(cacheKey, stored);
      return stored;
    }

    try {
      const data = await fetchWithToken(`${BASE_URL}?q=${encodeURIComponent(name)}&limit=1`);
      if (data.data?.objects && data.data.objects.length > 0) {
        const country = data.data.objects[0];
        memoryCache.set(cacheKey, country);
        setToStorage(cacheKey, country);
        return country;
      }
      throw new Error(`Country ${name} not found in API`);
    } catch (err) {
      console.warn(`REST Countries API query failed for "${name}". Using fallback dataset:`, err);
      const fallbackList = await loadFallbackCountries();
      const target = decodeURIComponent(name).toLowerCase().trim();

      const found =
        fallbackList.find((c) => {
          const common = c.names?.common?.toLowerCase();
          const official = c.names?.official?.toLowerCase();
          const alpha2 = c.codes?.alpha_2?.toLowerCase();
          const alpha3 = c.codes?.alpha_3?.toLowerCase();
          const alternates = c.names?.alternates?.map((a) => a.toLowerCase()) || [];
          return (
            common === target ||
            official === target ||
            alpha2 === target ||
            alpha3 === target ||
            alternates.includes(target)
          );
        }) ||
        fallbackList.find((c) => {
          const common = c.names?.common?.toLowerCase() || '';
          return common.includes(target) || target.includes(common);
        });

      if (found) {
        memoryCache.set(cacheKey, found);
        return found;
      }

      throw new Error(`Country ${name} not found`);
    }
  },

  getByCodes: async (codes) => {
    if (!codes || codes.length === 0) return [];

    const promises = codes.map(async (code) => {
      const codeKey = `code_${code}`;
      if (memoryCache.has(codeKey)) return memoryCache.get(codeKey);

      try {
        const res = await fetchWithToken(`${BASE_URL}/codes.alpha_3/${code}`);
        if (res?.data?.objects?.[0]) {
          memoryCache.set(codeKey, res.data.objects[0]);
          return res.data.objects[0];
        }
        throw new Error('Not found in API');
      } catch {
        const fallbackList = await loadFallbackCountries();
        const upper = code.toUpperCase();
        const found = fallbackList.find(
          (c) =>
            c.codes?.alpha_3?.toUpperCase() === upper ||
            c.codes?.alpha_2?.toUpperCase() === upper ||
            c.borders?.includes(upper) ||
            c.names?.common?.toUpperCase() === upper
        );
        if (found) {
          memoryCache.set(codeKey, found);
          return found;
        }
        return null;
      }
    });

    const results = await Promise.all(promises);
    return results.filter(Boolean);
  },

  getByRegion: async (region) => {
    const cacheKey = `region_${region.toLowerCase()}`;
    if (memoryCache.has(cacheKey)) return memoryCache.get(cacheKey);

    try {
      const data = await fetchAllPaginated(`${BASE_URL}?region=${encodeURIComponent(region)}`);
      if (Array.isArray(data) && data.length > 0) {
        memoryCache.set(cacheKey, data);
        return data;
      }
      throw new Error('Empty region response');
    } catch (err) {
      console.warn(`REST Countries API query failed for region "${region}". Using fallback dataset:`, err);
      const fallbackList = await loadFallbackCountries();
      const filtered = fallbackList.filter(
        (c) => c.region?.toLowerCase() === region.toLowerCase()
      );
      memoryCache.set(cacheKey, filtered);
      return filtered;
    }
  },
};
