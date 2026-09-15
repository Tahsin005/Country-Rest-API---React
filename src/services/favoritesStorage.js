const STORAGE_KEY = 'atlas_favorite_countries';

export const favoritesStorage = {
  getFavorites: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isFavorite: (identifier) => {
    if (!identifier) return false;
    const favs = favoritesStorage.getFavorites();
    const idLower = identifier.toLowerCase();
    return favs.some((item) =>
      (item.code && item.code.toLowerCase() === idLower) ||
      (item.name && item.name.toLowerCase() === idLower)
    );
  },

  toggleFavorite: (country) => {
    if (!country) return false;
    const favs = favoritesStorage.getFavorites();
    const code = country.codes?.alpha_3 || country.cca3 || country.name;
    const name = country.names?.common || country.name;
    const flag = country.flag?.url_svg || country.flag;

    const existingIndex = favs.findIndex((f) =>
      (f.code && f.code === code) || (f.name && f.name.toLowerCase() === name.toLowerCase())
    );

    let isNowSaved = false;
    if (existingIndex >= 0) {
      favs.splice(existingIndex, 1);
      isNowSaved = false;
    } else {
      favs.push({ code, name, flag, region: country.region });
      isNowSaved = true;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    window.dispatchEvent(new CustomEvent('atlas_favorites_changed', { detail: { favorites: favs } }));
    return isNowSaved;
  },

  subscribe: (callback) => {
    const handler = (event) => {
      callback(event.detail?.favorites || favoritesStorage.getFavorites());
    };
    window.addEventListener('atlas_favorites_changed', handler);
    return () => window.removeEventListener('atlas_favorites_changed', handler);
  },
};
