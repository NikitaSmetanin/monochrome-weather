export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
  sunrise: string;
  sunset: string;
  daily: DailyForecast[];
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
}

export interface GeoCity {
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  admin1?: string;
}

const WMO_CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snowfall",
  73: "Moderate snowfall",
  75: "Heavy snowfall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

export function getWeatherCondition(code: number): string {
  return WMO_CODES[code] || "Unknown";
}

export function isRainy(code: number): boolean {
  return [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code);
}

export function isSnowy(code: number): boolean {
  return [71, 73, 75, 77, 85, 86].includes(code);
}

export function isWindy(windSpeed: number): boolean {
  return windSpeed > 30;
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=10`
  );
  if (!res.ok) throw new Error("Failed to fetch weather");
  const data = await res.json();
  const daily: DailyForecast[] = (data.daily.time as string[]).map((date, i) => ({
    date,
    weatherCode: data.daily.weather_code[i],
    tempMax: Math.round(data.daily.temperature_2m_max[i]),
    tempMin: Math.round(data.daily.temperature_2m_min[i]),
  }));
  return {
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
    sunrise: data.daily.sunrise[0],
    sunset: data.daily.sunset[0],
    daily,
  };
}

export async function searchCities(query: string): Promise<GeoCity[]> {
  if (query.length < 2) return [];
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en`
  );
  if (!res.ok) return [];
  const data = await res.json();
  if (!data.results) return [];
  return data.results.map((r: any) => ({
    name: r.name,
    country: r.country,
    countryCode: r.country_code,
    latitude: r.latitude,
    longitude: r.longitude,
    admin1: r.admin1,
  }));
}

export function getClothingRecommendation(weather: WeatherData): { text: string; icon: string } {
  const { temperature, weatherCode, windSpeed } = weather;
  const rainy = isRainy(weatherCode);
  const snowy = isSnowy(weatherCode);
  const windy = isWindy(windSpeed);

  let suggestions: string[] = [];

  if (temperature <= 0) {
    suggestions.push("Heavy winter coat, thermal layers, warm hat, gloves, and insulated boots");
  } else if (temperature <= 10) {
    suggestions.push("Warm coat, scarf, and gloves");
  } else if (temperature <= 18) {
    suggestions.push("Hoodie or light jacket with long pants");
  } else if (temperature <= 25) {
    suggestions.push("Light clothing — t-shirt and jeans");
  } else {
    suggestions.push("Light breathable clothing — t-shirt and shorts");
  }

  if (rainy) suggestions.push("Don't forget an umbrella or waterproof jacket");
  if (snowy) suggestions.push("Wear waterproof boots and warm layers");
  if (windy) suggestions.push("Add a windproof outer layer");

  const icon = rainy ? "☂" : snowy ? "❄" : temperature <= 10 ? "🧥" : temperature <= 20 ? "👔" : "👕";

  return { text: suggestions.join(". ") + ".", icon };
}
