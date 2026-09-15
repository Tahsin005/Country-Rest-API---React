import { useQuery } from '@tanstack/react-query';
import { countryApi } from '../services/api';
import { weatherApi } from '../services/weatherApi';
import { currencyApi } from '../services/currencyApi';
import { wikiApi } from '../services/wikiApi';
import { holidaysApi } from '../services/holidaysApi';

export const useAllCountries = () => {
  return useQuery({
    queryKey: ['countries', 'all'],
    queryFn: countryApi.getAll,
    staleTime: 1000 * 60 * 15, // 15 mins
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useCountryByName = (name) => {
  return useQuery({
    queryKey: ['country', name?.toLowerCase()],
    queryFn: () => countryApi.getByName(name),
    enabled: Boolean(name),
    staleTime: 1000 * 60 * 15,
  });
};

export const useBorderCountries = (borders) => {
  return useQuery({
    queryKey: ['borders', borders],
    queryFn: () => countryApi.getByCodes(borders),
    enabled: Boolean(borders && borders.length > 0),
    staleTime: 1000 * 60 * 15,
  });
};

export const useWeather = (lat, lng) => {
  const valid = lat !== undefined && lng !== undefined && lat !== null && lng !== null;
  const roundedLat = valid ? Number(lat).toFixed(2) : null;
  const roundedLng = valid ? Number(lng).toFixed(2) : null;

  return useQuery({
    queryKey: ['weather', roundedLat, roundedLng],
    queryFn: () => weatherApi.getForecast(lat, lng),
    enabled: valid,
    staleTime: 1000 * 60 * 5, // 5 mins for weather
  });
};

export const useCurrencyRates = () => {
  return useQuery({
    queryKey: ['currencyRates'],
    queryFn: currencyApi.getRates,
    staleTime: 1000 * 60 * 30, // 30 mins
  });
};

export const useWikiSummary = (name) => {
  return useQuery({
    queryKey: ['wiki', name],
    queryFn: () => wikiApi.getSummary(name),
    enabled: Boolean(name),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useHolidays = (alpha2Code) => {
  return useQuery({
    queryKey: ['holidays', alpha2Code?.toUpperCase()],
    queryFn: () => holidaysApi.getUpcomingHolidays(alpha2Code),
    enabled: Boolean(alpha2Code && alpha2Code.length === 2),
    staleTime: 1000 * 60 * 60 * 12, // 12 hours
  });
};
