import http from "./http";

async function geocodeCity(name) {
  try {
    const res = await http.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: name,
        format: "json",
        limit: 1,
      },
    });

    if (res.data.length === 0) throw new Error("Ville introuvable");

    const p = res.data[0];
    return {
      name: p.display_name.split(",")[0],
      country: p.display_name.split(",").slice(-1)[0],
      lat: parseFloat(p.lat),
      lon: parseFloat(p.lon),
    };
  } catch (err) {
    throw err;
  }
}

export async function fetchWeatherByCity(name) {
  try {
    const place = await geocodeCity(name);

    const res = await http.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: place.lat,
        longitude: place.lon,
        current_weather: true,
        daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode",
        timezone: "auto",
      },
    });

    return { place, forecast: res.data };
  } catch (err) {
    throw err;
  }
}
