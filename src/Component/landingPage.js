import React, { useState, useEffect } from "react";
import axios from "axios";
import Umbrella from "../assets/images/icons/icon-umberella.png";
import Wind from "../assets/images/icons/icon-wind.png";
import Compass from "../assets/images/icons/icon-compass.png";
import Day from "../assets/images/day.jpg"
export default function LandingPage() {
    const [city, setCity] = useState("")
    const [location, setLocation] = useState({ name: "", country: "", latitude: "", longitude: "", description: "" });
    const [currentWeather, setCurrentWeather] = useState(null);
    const [temperature, setTemperature] = useState("");
    const [icon, setIcon] = useState("")
    const [wind, setWind] = useState("")
    const [humidity, setHumidity] = useState("")
    const [forecastData, setForecastData] = useState(null);
    const [forecastHrsData, setForecastHrsData] = useState(null);
    const [dark, white] = useState(false)

    const getWeatherApi = async () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const apiKey = "efe5e49a8f9903142b34845847c5af83";
                const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`

                try {
                    const response = await axios.get(currentWeatherUrl);
                    if (response.status === 200) {
                        setLocation({
                            name: response.data.name,
                            country: response.data.sys.country,
                            description: response.data.weather.map((data) => {
                                return data.description
                            }),
                            latitude,
                            longitude,

                        });
                        setCurrentWeather(response.data.dt)
                        setTemperature(response.data.main.temp)
                        setIcon(response.data.weather.map((data) => {
                            return data.icon
                        }))
                        setWind(response.data.wind.speed)
                        setHumidity(response.data.main.humidity)

                    }
                } catch (error) {
                    console.log(error);
                }
            });
        }

    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const apiKey = "efe5e49a8f9903142b34845847c5af83";
                const days = 8 * 8

                try {
                    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=${days}&appid=${apiKey}`);
                    if (response.status === 200) {
                        const dailyForecast = response.data.list.filter((item, index) => index % 8 === 0);
                        setForecastData(dailyForecast);
                        console.log(dailyForecast)
                    }
                } catch (error) {
                    console.error('Error fetching forecast data:', error);
                }
            });
        }
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const apiKey = "efe5e49a8f9903142b34845847c5af83";

                try {
                    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=48&appid=${apiKey}`);
                    if (response.status === 200) {
                        setForecastHrsData(response.data.list);
                    }
                } catch (error) {
                    console.error('Error fetching forecast data:', error);
                }
            });
        }
    }, []);

    const searchWeather = async (e) => {
        e.preventDefault()
        const days = 7 * 8
        const hoursInterval = 3;

        if (city) {
            try {
                const apiKey = "efe5e49a8f9903142b34845847c5af83";
                const weatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${days}&appid=${apiKey}`;
                const response = await axios.get(weatherURL, {
                });
                console.log("search", response.data)

                setLocation({
                    name: response.data.city.name,
                    country: response.data.city.country,
                    description: response.data.list[0].weather.map((data) => {
                        return data.description
                    }),
                    latitude: response.data.city.coord.lat,
                    longitude: response.data.city.coord.lon,

                });
                setCurrentWeather(response.data.list[0].dt)
                setTemperature((response.data.list[0].main.temp - 273.15).toFixed(2))
                setIcon(response.data.list[0].weather.map((data) => {
                    return data.icon
                }))
                setWind(response.data.list[0].wind.speed)
                const dailyForecast = response.data.list.filter((item, index) => index % 8 === 0);
                setForecastData(dailyForecast);
                const hourlyForecast = response.data.list.filter((item, index) => index % hoursInterval === 0);
                setForecastHrsData(hourlyForecast);
                console.log(hourlyForecast)
                setCity("")
            } catch (error) {
                console.error('Error fetching forecast data:', error);
            }
        }
    };


    const handleTheme = () => {
        white(!dark)
    }

    useEffect(() => {
        getWeatherApi();
    }, []);

    return (
        <>
            <div className={dark ? 'dark' : 'white'}>
                <h2 style={{ textAlign: "center", padding: "10px", color: "#dad19b" }}>Weather Forecast</h2>
                <div className="hero" data-bg-image={Day}>
                    <span className="icon" onClick={handleTheme}>
                        {dark ? '☀️' : '🌙'}
                    </span>
                    <div className="container">
                        <form onSubmit={searchWeather} className="find-location">
                            <input type="text" placeholder="Find your location..." value={city} onChange={e => setCity(e.target.value)} ></input>
                            <input type="submit" value="Find" ></input>
                        </form>
                    </div>
                </div>
                <div className="forecast-table">
                    <div className="container">
                        <div className={dark ? 'forecast-container dark' : 'forecast-container'}>
                            <div className="today forecast">
                                <div className="forecast-header">
                                    <div className="day">{new Date(currentWeather * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                    <div className="date">{new Date(currentWeather * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                                </div>
                                <div className="forecast-display">
                                    <div className="forecast-content">
                                        <div className="location">{location.name} {location.country}</div>
                                        <div className="degree">
                                            <div className="num">{temperature}<sup>o</sup>C</div>
                                            <div className="forecast-icon">
                                                <img src={`http://openweathermap.org/img/w/${icon}.png`} alt="" width="90" />
                                            </div>
                                        </div>
                                        <span><img src={Umbrella} alt="" />{humidity}%</span>
                                        <span><img src={Wind} alt="" />{wind}km/h</span>
                                        <span><img src={Compass} alt="" />{location.description}</span>
                                    </div>
                                </div>
                            </div>
                            {forecastData && forecastData?.map((val, index) => {
                                const date = new Date(val.dt * 1000);
                                const time = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

                                return (

                                    <>
                                        <div className="forecast" key={index}>
                                            <div className="forecast-header">
                                                <div className="day">{new Date(val.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                                            </div>
                                            {/* <!-- .forecast-header --> */}
                                            <div className="forecast-content">
                                                <div className="forecast-icon">
                                                    <img src={`http://openweathermap.org/img/w/${val.weather[0].icon}.png`} alt="" width="48" />
                                                    <p>{val.weather[0].description}</p>

                                                </div>
                                                <br />
                                                <div className="degree">{(val.main.temp - 273.15).toFixed(2)}<sup>o</sup>C</div>
                                                <small>{val.main.humidity}%</small>
                                            </div>
                                        </div>
                                    </>
                                )

                            })}
                            <div className="heading-section">
                                <h4 className="heading" style={{ textAlign: "center", marginTop: "30px" }}>Hourly Forecast for next 48 HRS</h4>
                                <div className="clear"></div>
                            </div>
                            <br />

                            {forecastHrsData && forecastHrsData?.map((val, index) => {
                                const date = new Date(val.dt * 1000);
                                const time = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
                                return (

                                    <>
                                        <div className="forecast" key={index}>
                                            <div className="forecast-header">
                                                <div className="day">{val.dt_txt}</div>
                                            </div>
                                            <div className="forecast-content">
                                                <div className="forecast-icon">
                                                    <img src={`http://openweathermap.org/img/w/${val.weather[0].icon}.png`} alt="" width="48" />
                                                    <p>{val.weather[0].description}</p>
                                                </div>
                                                <br />
                                                <div className="degree">{(val.main.temp - 273.15).toFixed(2)}<sup>o</sup>C</div>
                                                <small>{val.main.humidity}%</small>
                                            </div>
                                        </div>
                                    </>
                                )


                            })}


                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}