import { useEffect, useState } from "react";
import { fetchWeatherByCity } from "../../API/meteo";

// mapping weather codes -> emoji/icône
const WMO_ICON = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌧️",
  61: "🌦️", 63: "🌧️", 65: "🌧️",
  66: "🌨️", 67: "🌨️",
  71: "🌨️", 73: "❄️", 75: "❄️",
  77: "❄️",
  80: "🌧️", 81: "🌧️", 82: "🌧️",
  85: "🌨️", 86: "🌨️",
  95: "⛈️", 96: "⛈️", 97: "⛈️",
};

export default function WeatherWidget({ defaultCity = "Tunis" }) {
  const [city, setCity] = useState(defaultCity);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [place, setPlace] = useState(null);
  const [forecast, setForecast] = useState(null);

  const load = async (name) => {
    try {
      setErr("");
      setLoading(true);
      const res = await fetchWeatherByCity(name);
      setPlace(res.place);
      setForecast(res.forecast);
    } catch (e) {
      setErr(e?.message || "Erreur de chargement");
      setPlace(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(defaultCity);
  }, [defaultCity]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    load(city.trim());
  };

  const current = forecast?.current_weather;
  const daily = forecast?.daily;

  return (
    <section className="mt-10 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-[#025244]">Météo</h2>
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            className="rounded-xl border border-slate-300 px-3 py-2 focus:border-[#025244] focus:ring-[#025244]"
            placeholder="Saisir une ville (ex: Tunis, Paris...)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button className="px-4 py-2 rounded-xl bg-[#025244] text-white hover:opacity-90">
            Chercher
          </button>
        </form>
      </div>

      {loading && <p className="mt-4 text-slate-600">Chargement…</p>}
      {err && <p className="mt-4 text-red-600">{err}</p>}

      {!loading && !err && current && (
        <>
          <div className="mt-4 flex items-center gap-4">
            <div className="text-4xl">{WMO_ICON[current.weathercode] ?? "🌡️"}</div>
            <div>
              <div className="text-lg font-semibold">
                {place?.name} {place?.country ? `(${place.country})` : ""}
              </div>
              <div className="text-slate-600">
                Actuellement : <span className="font-semibold">{current.temperature}°C</span> • Vent {current.windspeed} km/h
              </div>
              {forecast?.timezone && (
                <div className="text-slate-500 text-sm">Fuseau : {forecast.timezone}</div>
              )}
            </div>
          </div>

          {daily?.time?.length ? (
            <div className="mt-6">
              <h3 className="font-medium text-slate-700">Prochains jours</h3>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {daily.time.slice(0, 5).map((d, i) => (
                  <div key={d} className="rounded-xl border border-slate-200 p-3 text-sm bg-slate-50">
                    <div className="font-semibold">
                      {new Date(d).toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "2-digit" })}
                    </div>
                    <div className="mt-1">{WMO_ICON[daily.weathercode?.[i]] ?? "⛅"}</div>
                    <div className="mt-1">
                      <span className="font-semibold">{Math.round(daily.temperature_2m_max[i])}°</span> / {Math.round(daily.temperature_2m_min[i])}°
                    </div>
                    {"precipitation_probability_max" in daily && (
                      <div className="text-slate-600 mt-1">
                        Pluie: {daily.precipitation_probability_max?.[i] ?? 0}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

export { WeatherWidget };

