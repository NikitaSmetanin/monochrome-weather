import {
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
} from "lucide-react";
import { WeatherData, getWeatherCondition } from "@/lib/weather";

function WeatherIcon({ code, size = 64 }: { code: number; size?: number }) {
  const props = { size, strokeWidth: 1.5 };
  if ([0, 1].includes(code)) return <Sun {...props} />;
  if ([2, 3].includes(code)) return <Cloud {...props} />;
  if ([45, 48].includes(code)) return <CloudFog {...props} />;
  if ([51, 53, 55, 56, 57].includes(code)) return <CloudDrizzle {...props} />;
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return <CloudRain {...props} />;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow {...props} />;
  if ([95, 96, 99].includes(code)) return <CloudLightning {...props} />;
  return <Cloud {...props} />;
}

interface WeatherDisplayProps {
  weather: WeatherData;
  cityName: string;
}

export function WeatherDisplay({ weather, cityName }: WeatherDisplayProps) {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
          {cityName}
        </p>
        <div className="flex items-center justify-center">
          <WeatherIcon code={weather.weatherCode} />
        </div>
        <p className="text-7xl sm:text-8xl font-light tracking-tighter">
          {weather.temperature}°
        </p>
        <p className="text-sm text-muted-foreground">
          {getWeatherCondition(weather.weatherCode)}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
        <Stat icon={<Thermometer size={16} />} label="Feels like" value={`${weather.feelsLike}°`} />
        <Stat icon={<Droplets size={16} />} label="Humidity" value={`${weather.humidity}%`} />
        <Stat icon={<Wind size={16} />} label="Wind" value={`${weather.windSpeed} km/h`} />
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 rounded-md bg-card border border-border">
      <div className="text-muted-foreground">{icon}</div>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
