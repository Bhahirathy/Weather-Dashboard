import React, { useState, useEffect } from "react";
import axios from "axios";
import ForecastIcon from "../assets/images/icons/icon-1.svg";
import Umbrella from "../assets/images/icons/icon-umberella.png";
import Wind from "../assets/images/icons/icon-wind.png";
import Compass from "../assets/images/icons/icon-compass.png";
import Day from "../assets/images/day.jpg"
export default function LandingPage() {
    const [city, setCity] = useState("")
    const [location, setLocation] = useState({ name: "", latitude: "", longitude: "", description: "" });
    const [currentWeather, setCurrentWeather] = useState(null);
    const [temperature, setTemperature] = useState("");
    const [icon, setIcon] = useState("")
    const [wind, setWind] = useState("")
    const [forecast, setForecast] = useState([]);
    const [forecastData, setForecastData] = useState(null);
    const [forecastHrsData, setForecastHrsData] = useState(null);
    const [dark, white] = useState(false)

    const getWeatherApi = async () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const apiKey = "efe5e49a8f9903142b34845847c5af83";
                const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
                const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`

                try {
                    const response = await axios.get(currentWeatherUrl);
                    if (response.status === 200) {
                        // console.log("hftyf", response.data);
                        setLocation({
                            name: response.data.name,
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
                        // setForecastData(response.data);
                        // console.log("fore", response.data)
                        const dailyForecast = response.data.list.filter((item, index) => index % 8 === 0);
                        setForecastData(dailyForecast);
                        // console.log(dailyForecast)
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
                        setForecastHrsData(response.data);
                        // console.log("forehrs", response.data)
                    }
                } catch (error) {
                    console.error('Error fetching forecast data:', error);
                }
            });
        }
    }, []);

    const searchWeather = async (e) => {
        e.preventDefault()
        console.log("button")
        const days = 8 * 8

        if (city) {
            try {

                const apiKey = "efe5e49a8f9903142b34845847c5af83";
                const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&cnt=${days}&appid=${apiKey}`;
                const response = await axios.get(weatherURL, {
                });
                // setForecast(response.data)
                console.log("search", response.data)

                setLocation({
                    name: response.data.name,
                    description: response.data.weather.map((data) => {
                        return data.description
                    }),

                });
                setCurrentWeather(response.data.dt)
                setTemperature(response.data.main.temp)
                setIcon(response.data.weather.map((data) => {
                    return data.icon
                }))
                setWind(response.data.wind.speed)
                const dailyForecast = response.data.list.filter((item, index) => index % 8 === 0);
                setForecastData(dailyForecast);
            } catch (error) {
                console.error('Error fetching forecast data:', error);
            }
        }
    };

    const handleTheme = () => {
        console.log(dark)
        white(!dark)

    }

    useEffect(() => {
        getWeatherApi();
    }, []);

    return (
        <>
            <div className={dark ? 'dark' : 'white'}>
                <div className="hero" data-bg-image={Day}>
                    <button onClick={handleTheme}>Theme</button>
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
                                {/* <!-- .forecast-header --> */}
                                <div className="forecast-display">
                                    <div className="forecast-content">
                                        <div className="location">{location.name}</div>
                                        <div className="degree">
                                            <div className="num">{temperature}<sup>o</sup>C</div>
                                            <div className="forecast-icon">
                                                <img src={`http://openweathermap.org/img/w/${icon}.png`} alt="" width="90" />
                                            </div>
                                        </div>
                                        <span><img src={Umbrella} alt="" />20%</span>
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
                                                </div>
                                                <div className="degree">{(val.main.temp - 273.15).toFixed(2)}<sup>o</sup>C</div>
                                                <small>{val.main.humidity}%</small>
                                            </div>
                                        </div>
                                    </>
                                )

                            })}
                            <br />

                            <h4 style={{ textAlign: "center" }}>Hourly Forecast for next 48 HRS</h4>
                            {forecastHrsData && forecastHrsData?.list.map((val, index) => {
                                const date = new Date(val.dt * 1000);
                                const time = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
                                return (

                                    <>
                                        <div className="forecast" key={index}>
                                            <div className="forecast-header">
                                                <div className="day">{val.dt_txt}</div>
                                            </div>
                                            {/* <!-- .forecast-header --> */}
                                            <div className="forecast-content">
                                                <div className="forecast-icon">
                                                    <img src={`http://openweathermap.org/img/w/${val.weather[0].icon}.png`} alt="" width="48" />
                                                </div>
                                                <div className="degree">{(val.main.temp - 273.15).toFixed(2)}<sup>o</sup>C</div>
                                                <small>{val.main.humidity}%</small>
                                            </div>
                                        </div>
                                    </>
                                )
                                // }
                                // return null

                            })}

                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}