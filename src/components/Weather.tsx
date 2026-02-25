import React, { useState, useEffect, useCallback } from 'react';
import { Cloud, Sun, CloudRain, Wind, MapPin, Loader2, RefreshCw, Droplets } from 'lucide-react';
import { motion } from 'motion/react';

interface WeatherData {
  temp: number;
  condition: string;
  location: string;
  humidity: number;
  windSpeed: number;
  lastUpdated: string;
}

export const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setRefreshing(true);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`
      );
      const data = await response.json();
      
      setWeather({
        temp: Math.round(data.current_weather.temperature),
        condition: getWeatherCondition(data.current_weather.weathercode),
        location: "Xorazm",
        humidity: data.hourly.relativehumidity_2m[0],
        windSpeed: data.current_weather.windspeed,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const initFetch = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(41.5504, 60.6315) // Urgench, Khorezm
      );
    };

    initFetch();
    const interval = setInterval(initFetch, 600000); // Refresh every 10 mins
    return () => clearInterval(interval);
  }, [fetchWeather]);

  const getWeatherCondition = (code: number) => {
    if (code === 0) return "Ochiq";
    if (code <= 3) return "Bulutli";
    if (code >= 45 && code <= 48) return "Tuman";
    if (code >= 51 && code <= 67) return "Yomg'ir";
    if (code >= 71 && code <= 77) return "Qor";
    return "O'zgaruvchan";
  };

  const getIcon = (condition: string) => {
    if (condition.includes("Ochiq")) return <Sun className="w-14 h-14 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]" />;
    if (condition.includes("Yomg'ir")) return <CloudRain className="w-14 h-14 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.4)]" />;
    return <Cloud className="w-14 h-14 text-slate-400 drop-shadow-[0_0_15px_rgba(148,163,184,0.4)]" />;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full bg-black">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      <span className="text-[10px] mt-4 uppercase tracking-[0.2em] text-blue-500/50">Sinxronizatsiya</span>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-black text-white p-3 overflow-hidden">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
          <MapPin size={8} className="text-blue-400" />
          <span className="text-[8px] font-bold tracking-tight uppercase">{weather?.location}</span>
        </div>
        <button 
          onClick={() => navigator.geolocation.getCurrentPosition(p => fetchWeather(p.coords.latitude, p.coords.longitude))}
          className={`p-1 rounded-full bg-white/5 border border-white/10 active:scale-90 transition-all ${refreshing ? 'animate-spin' : ''}`}
        >
          <RefreshCw size={8} />
        </button>
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center py-1"
      >
        {getIcon(weather?.condition || "")}
        <div className="relative mt-1">
          <h1 className="text-5xl font-thin tracking-tighter">{weather?.temp}</h1>
          <span className="absolute -top-1 -right-3 text-xl font-light text-blue-400">°</span>
        </div>
        <p className="text-[9px] font-medium tracking-widest uppercase opacity-40">{weather?.condition}</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-2 mt-auto">
        <div className="bg-white/5 rounded-xl p-2 border border-white/10 flex flex-col items-center">
          <Wind size={12} className="text-blue-400 mb-0.5" />
          <span className="text-[9px] font-mono font-bold">{weather?.windSpeed}</span>
          <span className="text-[6px] uppercase opacity-30">km/h</span>
        </div>
        <div className="bg-white/5 rounded-xl p-2 border border-white/10 flex flex-col items-center">
          <Droplets size={12} className="text-blue-400 mb-0.5" />
          <span className="text-[9px] font-mono font-bold">{weather?.humidity}%</span>
          <span className="text-[6px] uppercase opacity-30">Namlik</span>
        </div>
      </div>
      
      <div className="text-[6px] text-center opacity-20 mt-2 uppercase tracking-widest">
        Yangilandi: {weather?.lastUpdated}
      </div>
    </div>
  );
};

