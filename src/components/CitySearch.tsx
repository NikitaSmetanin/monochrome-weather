import { useState, useRef, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { searchCities, GeoCity } from "@/lib/weather";

interface CitySearchProps {
  selectedCity: GeoCity | null;
  onSelect: (city: GeoCity) => void;
}

export function CitySearch({ selectedCity, onSelect }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoCity[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    clearTimeout(timerRef.current);
    if (value.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      const cities = await searchCities(value);
      setResults(cities);
      setLoading(false);
    }, 300);
  };

  return (
    <div ref={ref} className="relative w-full max-w-md mx-auto">
      <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2 bg-card">
        <Search size={16} className="text-muted-foreground shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            handleSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder={
            selectedCity
              ? `${selectedCity.name}, ${selectedCity.country}`
              : "Search for a city..."
          }
          className="bg-transparent outline-none w-full text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {open && (results.length > 0 || loading) && (
        <div className="absolute top-full mt-1 w-full bg-popover border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="px-3 py-4 text-sm text-muted-foreground text-center">Searching...</div>
          ) : (
            results.map((city, i) => (
              <button
                key={`${city.name}-${city.country}-${city.latitude}-${i}`}
                onClick={() => {
                  onSelect(city);
                  setQuery("");
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 text-sm hover:bg-accent transition-colors flex items-center gap-2"
              >
                <MapPin size={14} className="text-muted-foreground shrink-0" />
                <span className="font-medium">{city.name}</span>
                {city.admin1 && (
                  <span className="text-muted-foreground">{city.admin1},</span>
                )}
                <span className="text-muted-foreground">{city.country}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
