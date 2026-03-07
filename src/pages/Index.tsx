import { useEffect, useState, useCallback } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CitySearch } from "@/components/CitySearch";
import { WeatherDisplay } from "@/components/WeatherDisplay";
import { ClothingRecommendation } from "@/components/ClothingRecommendation";
import { fetchWeather, WeatherData, GeoCity } from "@/lib/weather";
import { Loader2 } from "lucide-react";

const DEFAULT_CITY: GeoCity = {
  name: "London",
  country: "United Kingdom",
  countryCode: "GB",
  latitude: 51.5074,
  longitude: -0.1278,
};

export default function Index() {
  const [city, setCity] = useState<GeoCity>(DEFAULT_CITY);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(lat, lon);
      setWeather(data);
    } catch {
      setError("Failed to load weather data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Try geolocation on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const geoCity: GeoCity = {
            name: "Your Location",
            country: "",
            countryCode: "",
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          // Try to reverse geocode using open-meteo
          try {
            const res = await fetch(
              `https://geocoding-api.open-meteo.com/v1/search?name=&latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&count=1`
            );
            // Fallback: just use coordinates
          } catch {}
          setCity(geoCity);
          loadWeather(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Geolocation denied, use default
          loadWeather(DEFAULT_CITY.latitude, DEFAULT_CITY.longitude);
        },
        { timeout: 5000 }
      );
    } else {
      loadWeather(DEFAULT_CITY.latitude, DEFAULT_CITY.longitude);
    }
  }, [loadWeather]);

  const handleCitySelect = (newCity: GeoCity) => {
    setCity(newCity);
    loadWeather(newCity.latitude, newCity.longitude);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-border">
        <h1 className="text-sm font-mono uppercase tracking-[0.2em] font-medium">
          Weather
        </h1>
        <ThemeToggle />
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-16 gap-10">
        <CitySearch selectedCity={city} onSelect={handleCitySelect} />

        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Loading weather...</span>
          </div>
        )}

        {error && (
          <p className="text-sm text-muted-foreground">{error}</p>
        )}

        {!loading && !error && weather && (
          <>
            <WeatherDisplay
              weather={weather}
              cityName={city.name + (city.country ? `, ${city.country}` : "")}
            />
            <ClothingRecommendation weather={weather} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center border-t border-border">
        <p className="text-xs text-muted-foreground font-mono">
          Data from Open-Meteo · No API key required
        </p>
      </footer>
    </div>
  );
}
