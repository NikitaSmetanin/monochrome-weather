import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
} from "lucide-react";
import { DailyForecast as DailyForecastType } from "@/lib/weather";

function ForecastIcon({ code, size = 28 }: { code: number; size?: number }) {
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

function formatDay(dateStr: string, index: number): string {
  if (index === 0) return "Today";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

interface DailyForecastProps {
  days: DailyForecastType[];
}

export function DailyForecast({ days }: DailyForecastProps) {
  return (
    <div className="w-full max-w-3xl">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3 text-center">
        10-Day Forecast
      </p>
      <div className="overflow-x-auto -mx-4 px-4 pb-2">
        <div className="flex gap-3 min-w-max">
          {days.map((day, i) => (
            <div
              key={day.date}
              className="flex flex-col items-center gap-2 p-3 rounded-md bg-card border border-border min-w-[88px]"
            >
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                {formatDay(day.date, i)}
              </span>
              <div className="text-foreground py-1">
                <ForecastIcon code={day.weatherCode} />
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  {day.tempMax}°
                </span>
                <span className="text-xs text-muted-foreground">
                  {day.tempMin}°
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
