import React, { useState, useEffect } from "react";
import axios from "axios";
import ForecastIcon from "../assets/images/icons/icon-1.svg";
import Umbrella from "../assets/images/icons/icon-umberella.png";
import Wind from "../assets/images/icons/icon-wind.png";
import Compass from "../assets/images/icons/icon-compass.png";
export default function LandingPage() {
    const [city, setCity] = useState("")
    const [location, setLocation] = useState({ name: "", latitude: "", longitude: "", description: "" });
    const [currentWeather, setCurrentWeather] = useState(null);
    const [temperature, setTemperature] = useState("");
    const [icon, setIcon] = useState("")
    const [wind, setWind] = useState("")
    const [forecast, setForecast] = useState([]);
    const [forecastData, setForecastData] = useState(null);

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
                        console.log("hftyf", response.data);
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

                try {
                    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=7&appid=${apiKey}`);
                    if (response.status === 200) {
                        setForecastData(response.data);
                        console.log("fore", response.data)
                    }
                } catch (error) {
                    console.error('Error fetching forecast data:', error);
                }
            });
        }
    }, []);



    useEffect(() => {
        getWeatherApi();
    }, []);

    return (
        <>
            <div className="hero" data-bg-image="images/banner.png">
                <div className="container">
                    <form className="find-location">
                        <input type="text" placeholder="Find your location..."></input>
                        <input type="submit" value="Find"></input>
                    </form>

                </div>
            </div>
            <div className="forecast-table">
                <div className="container">
                    <div className="forecast-container">
                        <div className="today forecast">
                            <div className="forecast-header">
                                <div className="day">{new Date(currentWeather * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                <div className="date">{new Date(currentWeather * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                            </div>
                            {/* <!-- .forecast-header --> */}
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
                        {forecastData && forecastData?.list.map((val, index) => {
                            const date = new Date(val.dt * 1000);
                            const time = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
                            // if (time === '12:00 PM') {

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
                            // }
                            // return null

                        })}
                    </div>
                </div>
            </div>
        </>
    )
}