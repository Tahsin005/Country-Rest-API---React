const BASE_URL = 'https://api.restcountries.com/countries/v5';
const API_TOKEN = import.meta.env.VITE_RESTCOUNTRIES_API_TOKEN || 'rc_live_6e4eae1a39b94b3e94ffd666122f47ef';

// In-memory cache
const memoryCache = new Map();

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

    const data = await fetchAllPaginated(BASE_URL);
    memoryCache.set(cacheKey, data);
    setToStorage(cacheKey, data);
    return data;
  },

  getByName: async (name) => {
    const cacheKey = `country_${name.toLowerCase()}`;
    if (memoryCache.has(cacheKey)) return memoryCache.get(cacheKey);

    const stored = getFromStorage(cacheKey);
    if (stored) {
      memoryCache.set(cacheKey, stored);
      return stored;
    }

    const data = await fetchWithToken(`${BASE_URL}?q=${encodeURIComponent(name)}&limit=1`);
    if (!data.data.objects || data.data.objects.length === 0) {
      throw new Error(`Country ${name} not found`);
    }
    const country = data.data.objects[0];
    memoryCache.set(cacheKey, country);
    setToStorage(cacheKey, country);
    return country;
  },

  getByCodes: async (codes) => {
    if (!codes || codes.length === 0) return [];

    const promises = codes.map((code) => {
      const codeKey = `code_${code}`;
      if (memoryCache.has(codeKey)) return Promise.resolve(memoryCache.get(codeKey));

      return fetchWithToken(`${BASE_URL}/codes.alpha_3/${code}`)
        .then((res) => {
          if (res?.data?.objects?.[0]) {
            memoryCache.set(codeKey, res.data.objects[0]);
            return res.data.objects[0];
          }
          return null;
        })
        .catch(() => null);
    });

    const results = await Promise.all(promises);
    return results.filter(Boolean);
  },

  getByRegion: async (region) => {
    const cacheKey = `region_${region.toLowerCase()}`;
    if (memoryCache.has(cacheKey)) return memoryCache.get(cacheKey);

    const data = await fetchAllPaginated(`${BASE_URL}?region=${encodeURIComponent(region)}`);
    memoryCache.set(cacheKey, data);
    return data;
  },
};
