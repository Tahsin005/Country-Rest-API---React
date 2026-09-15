const wikiCache = new Map();

export const wikiApi = {
  getSummary: async (countryName) => {
    if (!countryName) return null;
    const cleanName = countryName.trim();
    if (wikiCache.has(cleanName)) return wikiCache.get(cleanName);

    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanName)}`,
        {
          headers: {
            'User-Agent': 'WorldAtlas/2.0 (education geographic explorer)',
          },
        }
      );

      if (!response.ok) return null;
      const data = await response.json();

      const result = {
        title: data.title,
        description: data.description,
        extract: data.extract,
        extractHtml: data.extract_html,
        thumbnail: data.thumbnail?.source || null,
        pageUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(cleanName)}`,
      };

      wikiCache.set(cleanName, result);
      return result;
    } catch (err) {
      console.warn('Wikipedia API fetch failed:', err);
      return null;
    }
  },
};
