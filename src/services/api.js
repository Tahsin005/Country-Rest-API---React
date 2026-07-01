const BASE_URL = 'https://api.restcountries.com/countries/v5';
const API_TOKEN = 'rc_live_6e4eae1a39b94b3e94ffd666122f47ef';

const fetchWithToken = async (url) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`
    }
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
    return await fetchAllPaginated(BASE_URL);
  },

  getByName: async (name) => {
    const data = await fetchWithToken(`${BASE_URL}?q=${encodeURIComponent(name)}&limit=1`);
    if (!data.data.objects || data.data.objects.length === 0) {
      throw new Error(`Country ${name} not found`);
    }
    return data.data.objects[0];
  },

  getByCodes: async (codes) => {
    if (!codes || codes.length === 0) return [];
    
    // v5 does not seem to have a batch code lookup, so we fetch each code individually.
    const promises = codes.map(code => 
      fetchWithToken(`${BASE_URL}/codes.alpha_3/${code}`).catch(() => null)
    );
    
    const results = await Promise.all(promises);
    return results
      .filter(res => res && res.data && res.data.objects && res.data.objects.length > 0)
      .map(res => res.data.objects[0]);
  },

  getByRegion: async (region) => {
    return await fetchAllPaginated(`${BASE_URL}?region=${encodeURIComponent(region)}`);
  }
};
