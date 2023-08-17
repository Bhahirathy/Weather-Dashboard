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
    const [forecast, setForecast] = useState([]);
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

                    }
                } catch (error) {
                    console.log(error);
                }
            });
        }

    };


    useEffect(() => {
        getWeatherApi();
    }, []);

    return (
        <>
            <div class="hero" data-bg-image="images/banner.png">
                <div class="container">
                    <form class="find-location">
                        <input type="text" placeholder="Find your location..."></input>
                        <input type="submit" value="Find"></input>
                    </form>

                </div>
            </div>
            <div class="forecast-table">
                <div class="container">
                    <div class="forecast-container">
                        <div class="today forecast">
                            <div class="forecast-header">
                                <div class="day">Monday</div>
                                <div class="date">{new Date(parseInt(currentWeather?.dt) * 1000).toLocaleDateString()}</div>
                            </div>
                            {/* <!-- .forecast-header --> */}
                            <div class="forecast-content">
                                <div class="location">{location.name}</div>
                                <div class="degree">
                                    <div class="num">23<sup>o</sup>C</div>
                                    <div class="forecast-icon">
                                        <img src={ForecastIcon} alt="" width="90" />
                                    </div>
                                </div>
                                <span><img src={Umbrella} alt="" />20%</span>
                                <span><img src={Wind} alt="" />18km/h</span>
                                <span><img src={Compass} alt="" />{location.description}</span>
                            </div>
                        </div>
                        {<div class="forecast">
                            <div class="forecast-header">
                                <div class="day">Tuesday</div>
                            </div>
                            {/* <!-- .forecast-header --> */}
                            <div class="forecast-content">
                                <div class="forecast-icon">
                                    <img src="images/icons/icon-3.svg" alt="" width="48" />
                                </div>
                                <div class="degree">23<sup>o</sup>C</div>
                                <small>18<sup>o</sup></small>
                            </div>
                        </div>}
                        <div class="forecast">
                            <div class="forecast-header">
                                <div class="day">Wednesday</div>
                            </div>
                            {/* <!-- .forecast-header --> */}
                            <div class="forecast-content">
                                <div class="forecast-icon">
                                    <img src="images/icons/icon-5.svg" alt="" width="48" />
                                </div>
                                <div class="degree">23<sup>o</sup>C</div>
                                <small>18<sup>o</sup></small>
                            </div>
                        </div>
                        <div class="forecast">
                            <div class="forecast-header">
                                <div class="day">Thursday</div>
                            </div>
                            {/* <!-- .forecast-header --> */}
                            <div class="forecast-content">
                                <div class="forecast-icon">
                                    <img src="images/icons/icon-7.svg" alt="" width="48" />
                                </div>
                                <div class="degree">23<sup>o</sup>C</div>
                                <small>18<sup>o</sup></small>
                            </div>
                        </div>
                        <div class="forecast">
                            <div class="forecast-header">
                                <div class="day">Friday</div>
                            </div>
                            {/* <!-- .forecast-header --> */}
                            <div class="forecast-content">
                                <div class="forecast-icon">
                                    <img src="images/icons/icon-12.svg" alt="" width="48" />
                                </div>
                                <div class="degree">23<sup>o</sup>C</div>
                                <small>18<sup>o</sup></small>
                            </div>
                        </div>
                        <div class="forecast">
                            <div class="forecast-header">
                                <div class="day">Saturday</div>
                            </div>
                            {/* <!-- .forecast-header --> */}
                            <div class="forecast-content">
                                <div class="forecast-icon">
                                    <img src="images/icons/icon-13.svg" alt="" width="48" />
                                </div>
                                <div class="degree">23<sup>o</sup>C</div>
                                <small>18<sup>o</sup></small>
                            </div>
                        </div>
                        <div class="forecast">
                            <div class="forecast-header">
                                <div class="day">Sunday</div>
                            </div>
                            {/* <!-- .forecast-header --> */}
                            <div class="forecast-content">
                                <div class="forecast-icon">
                                    <img src="images/icons/icon-14.svg" alt="" width="48" />
                                </div>
                                <div class="degree">23<sup>o</sup>C</div>
                                <small>18<sup>o</sup></small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}