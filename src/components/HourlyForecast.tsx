import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
} from "lucide-react";
import { HourlyForecast as HourlyForecastType } from "@/lib/weather";

function ForecastIcon({ code, size = 22 }: { code: number; size?: number }) {
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

function formatHour(timeStr: string): string {
  const d = new Date(timeStr);
  return d.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
}

interface HourlyForecastProps {
  hours: HourlyForecastType[];
}

export function HourlyForecast({ hours }: HourlyForecastProps) {
  return (
    <div className="w-full max-w-3xl">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3 text-center">
        Hourly Forecast
      </p>
      <div className="overflow-x-auto -mx-4 px-4 pb-2">
        <div className="flex gap-2 min-w-max">
          {hours.map((hour) => (
            <div
              key={hour.time}
              className="flex flex-col items-center gap-2 p-3 rounded-md bg-card border border-border min-w-[68px]"
            >
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                {formatHour(hour.time)}
              </span>
              <div className="text-foreground py-0.5">
                <ForecastIcon code={hour.weatherCode} />
              </div>
              <span className="text-sm font-medium text-foreground">
                {hour.temperature}°
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
