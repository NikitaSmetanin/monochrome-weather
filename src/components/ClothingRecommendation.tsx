import { Shirt } from "lucide-react";
import { WeatherData, getClothingRecommendation } from "@/lib/weather";

interface ClothingRecommendationProps {
  weather: WeatherData;
}

export function ClothingRecommendation({ weather }: ClothingRecommendationProps) {
  const rec = getClothingRecommendation(weather);

  return (
    <div className="flex items-start gap-3 p-4 rounded-md border border-border bg-card max-w-md mx-auto">
      <div className="shrink-0 mt-0.5">
        <Shirt size={20} />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          What to wear
        </p>
        <p className="text-sm leading-relaxed">{rec.text}</p>
      </div>
    </div>
  );
}
