export interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature?: number;
    is_day?: number;
    precipitation?: number;
    weather_code: number;
    wind_speed_10m: number;
    surface_pressure: number;
    visibility: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    uv_index: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    uv_index_max: number[];
    sunrise: string[];
    sunset: string[];
  };
  aqi?: {
    current?: {
      european_aqi?: number;
      us_aqi: number;
      pm2_5?: number;
      pm10?: number;
      carbon_monoxide?: number;
      nitrogen_dioxide?: number;
    };
  };
  resolved_name?: string;
}

export interface GeocodeResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,surface_pressure,visibility&hourly=temperature_2m,weather_code,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,sunrise,sunset&timezone=auto&models=best_match`;
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide&timezone=auto`;

  const [weatherRes, aqiRes] = await Promise.all([
    fetch(weatherUrl, { cache: 'no-store' }),
    fetch(aqiUrl, { cache: 'no-store' })
  ]);

  if (!weatherRes.ok || !aqiRes.ok) throw new Error('Failed to fetch weather or AQI data');

  const weatherData = await weatherRes.json();
  const aqiData = await aqiRes.json();

  return { ...weatherData, aqi: aqiData };
}

export function removeDiacritics(str: string): string {
  if (!str) return str;
  let normalized = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const map: Record<string, string> = {
    'ā': 'a', 'Ā': 'A', 'ē': 'e', 'Ē': 'E', 'ī': 'i', 'Ī': 'I',
    'ō': 'o', 'Ō': 'O', 'ū': 'u', 'Ū': 'U', 'ṉ': 'n', 'Ṉ': 'N',
    'ṭ': 't', 'Ṭ': 'T', 'ḍ': 'd', 'Ḍ': 'D', 'ṛ': 'r', 'Ṛ': 'R',
    'ṣ': 's', 'Ṣ': 'S', 'ś': 's', 'Ś': 'S', 'ṇ': 'n', 'Ṇ': 'N',
    'ṃ': 'm', 'Ṃ': 'M', 'ḥ': 'h', 'Ḥ': 'H',
  };
  return normalized.replace(/[āĀēĒīĪōŌūŪṉṈṭṬḍḌṛṚṣṢśŚṇṆṃṂḥḤ]/g, m => map[m]);
}

export async function searchLocation(query: string): Promise<{ results?: GeocodeResult[] }> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to search location');
  const data = await res.json();
  if (data.results) {
    data.results = data.results.map((r: any) => ({
      ...r,
      name: removeDiacritics(r.name),
      country: removeDiacritics(r.country || ''),
      admin1: r.admin1 ? removeDiacritics(r.admin1) : undefined
    }));
  }
  return data;
}

export async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  // Try BigDataCloud client-free reverse geocoder
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.village || data.town || data.principalSubdivision || "";
      const country = data.countryName || "";
      if (city) {
        return removeDiacritics(country ? `${city}, ${country}` : city);
      }
    }
  } catch (e) {
    console.error("BigDataCloud geocode failed:", e);
  }

  // Fallback to nominatim (OSM)
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'WeatherApp/1.0'
      },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.village || addr.suburb || addr.municipality || addr.state || "";
      const country = addr.country || "";
      if (city) {
        return removeDiacritics(country ? `${city}, ${country}` : city);
      }
    }
  } catch (e) {
    console.error("Nominatim geocode failed:", e);
  }

  return null;
}

export interface WeatherInterpretation {
  label: string;
  icon: 'Sun' | 'CloudSun' | 'Cloud' | 'CloudFog' | 'CloudDrizzle' | 'CloudRain' | 'Snowflake' | 'CloudLightning';
}

export const WEATHER_INTERPRETATION: Record<number, WeatherInterpretation> = {
  0: { label: 'Clear Sky', icon: 'Sun' },
  1: { label: 'Mainly Clear', icon: 'CloudSun' },
  2: { label: 'Partly Cloudy', icon: 'Cloud' },
  3: { label: 'Overcast', icon: 'Cloud' },
  45: { label: 'Foggy', icon: 'CloudFog' },
  48: { label: 'Depositing Rime Fog', icon: 'CloudFog' },
  51: { label: 'Light Drizzle', icon: 'CloudDrizzle' },
  53: { label: 'Moderate Drizzle', icon: 'CloudDrizzle' },
  55: { label: 'Dense Drizzle', icon: 'CloudDrizzle' },
  61: { label: 'Slight Rain', icon: 'CloudRain' },
  63: { label: 'Moderate Rain', icon: 'CloudRain' },
  65: { label: 'Heavy Rain', icon: 'CloudRain' },
  71: { label: 'Slight Snow', icon: 'Snowflake' },
  73: { label: 'Moderate Snow', icon: 'Snowflake' },
  75: { label: 'Heavy Snow', icon: 'Snowflake' },
  95: { label: 'Thunderstorm', icon: 'CloudLightning' },
};
