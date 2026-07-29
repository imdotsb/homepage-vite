import { cn } from "@cloudflare/kumo/utils";
import {
  CloudFogIcon,
  CloudIcon,
  CloudLightningIcon,
  CloudRainIcon,
  CloudSunIcon,
  SnowflakeIcon,
  SunIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { Icon } from "@phosphor-icons/react";
import { BentoCard } from "../BentoCard";

interface GeoResponse {
  eo?: {
    geo?: {
      latitude?: number;
      longitude?: number;
      cityName?: string;
    };
  };
}

interface OpenMeteoResponse {
  current?: { temperature_2m?: number; weather_code?: number };
  daily?: { temperature_2m_min?: number[]; temperature_2m_max?: number[] };
}

type WeatherTheme =
  | "qing"
  | "yun"
  | "yin"
  | "wu"
  | "yu"
  | "xue"
  | "lei"
  | "default";

const THEME_ICONS: Record<WeatherTheme, Icon> = {
  qing: SunIcon,
  yun: CloudSunIcon,
  yin: CloudIcon,
  wu: CloudFogIcon,
  yu: CloudRainIcon,
  xue: SnowflakeIcon,
  lei: CloudLightningIcon,
  default: CloudSunIcon,
};

/** WMO weather interpretation codes (Open-Meteo). */
const WEATHER_DESCRIPTIONS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
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
  96: "Thunderstorm with light hail",
  99: "Thunderstorm with heavy hail",
};

const RAIN_CODES = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82];
const SNOW_CODES = [71, 73, 75, 77, 85, 86];
const THUNDER_CODES = [95, 96, 99];

function getThemeKey(code: number): WeatherTheme {
  if (code === 0) return "qing";
  if (code === 1 || code === 2) return "yun";
  if (code === 3) return "yin";
  if (code === 45 || code === 48) return "wu";
  if (RAIN_CODES.includes(code)) return "yu";
  if (SNOW_CODES.includes(code)) return "xue";
  if (THUNDER_CODES.includes(code)) return "lei";
  return "default";
}

interface WeatherState {
  city: string;
  description: string;
  temp: number;
  min: number;
  max: number;
  theme: WeatherTheme;
}

async function loadWeather(): Promise<WeatherState> {
  const geoResponse = await fetch("https://api.staticdn.net/geo");
  if (!geoResponse.ok) throw new Error(`Geo HTTP ${geoResponse.status}`);
  const geoData: GeoResponse = await geoResponse.json();
  const geo = geoData.eo?.geo;
  if (typeof geo?.latitude !== "number" || typeof geo.longitude !== "number") {
    throw new Error("Geo API returned invalid data");
  }

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: String(geo.latitude),
    longitude: String(geo.longitude),
    daily: "temperature_2m_max,temperature_2m_min",
    current: "temperature_2m,weather_code",
    timezone: "auto",
    forecast_days: "1",
  }).toString();

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Weather HTTP ${response.status}`);
  const data: OpenMeteoResponse = await response.json();

  const temp = data.current?.temperature_2m;
  const code = data.current?.weather_code;
  const min = data.daily?.temperature_2m_min?.[0];
  const max = data.daily?.temperature_2m_max?.[0];
  if (
    typeof temp !== "number" ||
    typeof code !== "number" ||
    typeof min !== "number" ||
    typeof max !== "number"
  ) {
    throw new Error("Weather API returned invalid data");
  }

  return {
    city: geo.cityName || "Local weather",
    description:
      WEATHER_DESCRIPTIONS[code] ?? "Current conditions unavailable.",
    temp,
    min,
    max,
    theme: getThemeKey(code),
  };
}

export function WeatherCard() {
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadWeather()
      .then((state) => {
        if (!cancelled) setWeather(state);
      })
      .catch((error: unknown) => {
        console.error("Failed to fetch weather data:", error);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const theme = weather?.theme ?? "default";
  const ThemeIcon = THEME_ICONS[theme];

  return (
    <BentoCard className={cn("text-white ring-0", `weather-${theme}`)}>
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-0.5">
          <p className="text-sm text-white/80">Local weather</p>
          <h2 className="text-lg font-semibold">
            {failed ? "Weather unavailable" : (weather?.city ?? "Loading…")}
          </h2>
          <p className="text-sm text-white/80">
            {failed
              ? "Live weather data is unavailable right now."
              : (weather?.description ?? "")}
          </p>
        </div>
        <ThemeIcon
          size={40}
          weight="duotone"
          className="shrink-0 text-white/90"
        />
      </div>
      <div className="mt-4 text-right">
        <p className="text-5xl font-semibold">
          {failed ? "N/A" : weather ? `${Math.round(weather.temp)}°` : "--°"}
        </p>
        <p className="mt-1 text-sm text-white/80">
          {weather
            ? `${Math.round(weather.min)}° ~ ${Math.round(weather.max)}°`
            : ""}
        </p>
      </div>
    </BentoCard>
  );
}
