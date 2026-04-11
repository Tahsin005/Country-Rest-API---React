const BASE_URL = 'https://restcountries.com/v3.1';

export const FIELD_GROUPS = {
  LIST: 'name,capital,region,population,flags,cca3',
  DETAIL: 'name,capital,region,subregion,population,flags,cca3,tld,currencies,languages,borders,coatOfArms,maps,car',
};

export const countryApi = {
  getAll: async (fields = FIELD_GROUPS.LIST) => {
    const response = await fetch(`${BASE_URL}/all?fields=${fields}`);
    if (!response.ok) throw new Error('Failed to fetch countries');
    return response.json();
  },

  getByName: async (name, fields = FIELD_GROUPS.DETAIL) => {
    const response = await fetch(`${BASE_URL}/name/${name}?fullText=true&fields=${fields}`);
    if (!response.ok) throw new Error(`Country ${name} not found`);
    const data = await response.json();
    return data[0];
  },

  getByCodes: async (codes, fields = 'name') => {
    if (!codes || codes.length === 0) return [];
    const response = await fetch(`${BASE_URL}/alpha?codes=${codes.join(',')}&fields=${fields}`);
    if (!response.ok) throw new Error('Failed to fetch border countries');
    return response.json();
  },

  getByRegion: async (region, fields = FIELD_GROUPS.LIST) => {
    const response = await fetch(`${BASE_URL}/region/${region}?fields=${fields}`);
    if (!response.ok) throw new Error(`Failed to fetch countries in region: ${region}`);
    return response.json();
  }
};
