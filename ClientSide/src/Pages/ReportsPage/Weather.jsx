import React from "react";
import "./Weather.css";
import moment from "moment";
import "moment/locale/he";

const Weather = ({ forecast }) => {

  const getHebrewDay = (date) => {
    const daysOfWeek = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    const dayIndex = new Date(date).getDay();
    return daysOfWeek[dayIndex];
  };

  return (
    <div className="weather-container">
      {forecast &&
        forecast.map((day, index) => {
          const isCurrentDay = index === 0;
          return (
            <div className={`weather-day ${isCurrentDay ? "current-day" : ""}`} key={index}>
              <img className="weather-icon" src={day.day.condition.icon} alt="weather-icon"/>
              <div className="weather-date">{getHebrewDay(day.date)} - </div>
              <div className="weather-temp">{day.day.mintemp_c}°C - {day.day.maxtemp_c}°C - </div>
              <div className="weather-description">{day.day.condition.text}</div>
              {/*<div className="weather-temp">
                מקסימום: {day.day.maxtemp_c}°C | מינימום: {day.day.mintemp_c}°C
              </div>*/}
            </div>
          );
        })}
    </div>
  );
};

export default Weather;



