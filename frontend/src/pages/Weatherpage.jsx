import React, { useState } from "react";
import axios from "axios";

function Weatherpage() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleApi = async () => {
    const url = "http://127.0.0.1:8000/weather/bhubaneswar";

    try {
      setLoading(true);

      const response = await axios.get(url);

      setWeatherData(response.data);

      console.log(response.data);
    } catch (error) {
      console.log(error);
      alert("Error fetching weather data");
    } finally {
      setLoading(false);
    }
  };

  // Convert weather code to description
  const getWeatherDescription = (code) => {
    if (code === 0) return "Clear Sky";
    if (code === 1) return "Mainly Clear";
    if (code === 2) return "Partly Cloudy";
    if (code === 3) return "Overcast";
    if (code >= 45 && code <= 48) return "Fog";
    if (code >= 51 && code <= 57) return "Drizzle";
    if (code >= 61 && code <= 67) return "Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Rain Showers";
    if (code >= 95 && code <= 99) return "Thunderstorm";

    return "Unknown";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f2f6fc",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "auto",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>
          🌤️ Bhubaneswar Weather
        </h1>

        <button
          onClick={handleApi}
          disabled={loading}
          style={{
            display: "block",
            margin: "20px auto",
            padding: "12px 25px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {loading ? "Loading..." : "Get Weather Data"}
        </button>

        {weatherData && (
          <div>
            {/* Source */}
            <p
              style={{
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Source: {weatherData.source}
            </p>

            {/* Location */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              <h2>📍 Bhubaneswar, Odisha</h2>

              <p>
                Timezone: {weatherData.data.timezone}
              </p>

              <p>
                Elevation: {weatherData.data.elevation} m
              </p>
            </div>

            {/* Main Temperature */}
            <div
              style={{
                textAlign: "center",
                backgroundColor: "#eaf4ff",
                padding: "25px",
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            >
              <h1 style={{ fontSize: "50px", margin: "10px" }}>
                {weatherData.data.current.temperature_2m}
                {weatherData.data.current_units.temperature_2m}
              </h1>

              <h3>
                {getWeatherDescription(
                  weatherData.data.current.weather_code
                )}
              </h3>

              <p>
                Feels Like:{" "}
                {weatherData.data.current.apparent_temperature}
                {weatherData.data.current_units.apparent_temperature}
              </p>
            </div>

            {/* Weather Details */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div
                style={{
                  padding: "15px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                <h3>💧 Humidity</h3>

                <p style={{ fontSize: "20px" }}>
                  {weatherData.data.current.relative_humidity_2m}
                  {weatherData.data.current_units.relative_humidity_2m}
                </p>
              </div>

              <div
                style={{
                  padding: "15px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                <h3>💨 Wind Speed</h3>

                <p style={{ fontSize: "20px" }}>
                  {weatherData.data.current.wind_speed_10m}
                  {weatherData.data.current_units.wind_speed_10m}
                </p>
              </div>

              <div
                style={{
                  padding: "15px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                <h3>🌡️ Feels Like</h3>

                <p style={{ fontSize: "20px" }}>
                  {weatherData.data.current.apparent_temperature}
                  {weatherData.data.current_units.apparent_temperature}
                </p>
              </div>

              <div
                style={{
                  padding: "15px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                <h3>☁️ Weather Code</h3>

                <p style={{ fontSize: "20px" }}>
                  {weatherData.data.current.weather_code}
                </p>
              </div>
            </div>

            {/* Time */}
            <p
              style={{
                textAlign: "center",
                marginTop: "25px",
                color: "#666",
              }}
            >
              Last Updated: {weatherData.data.current.time}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Weatherpage;