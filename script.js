//Author: Sandesh Basnet
//Github: @Sandesh-Basnet
//TryHackMe: @Kastra
const api_key = "667d22c72d4ce8cfa3b87c113bb900a6";// OpenWeatherMap API Key
const api_url = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";//API URL 
const form = document.getElementById("weatherForm");// Form Element
const Input_city = document.getElementById("search_location");// Input Field Element
const search_btn = document.getElementById("search-btn");// Search Button Element
const location_display = document.getElementById("location");// Location Display Element
const time_display = document.getElementById("current_time");// Time Display Element
const day_display = document.getElementById("day");// Day Display Element
const date_display = document.getElementById("date");// Date Display Element
const weather_icon_display = document.getElementById("weather-condition-icon");// Weather Icon Display Element
const weather_condition_short_display = document.getElementById("weather-conditon-short");// Weather Condition Short Description Display Element
const temp_max_display = document.getElementById("temp_max_value");// Maximum Temperature Display Element
const temp_min_display = document.getElementById("temp_min_value");// Minimum Temperature Display Element
const humidity_display = document.getElementById("humidity_value");// Humidity Display Element
const wind_display = document.getElementById("wind_speed_value");// Wind Speed Display Element
const actual_temp_display = document.getElementById("actual_temperature")//Actual Temperature Display Element
const default_city = "East Riding of Yorkshire"//default city according to city sheet sent in MST
const weatherIconMapping = {//array for weather type and their icon class in font awesome to change icon according to the weather
    "Thunderstorm": "wi-thunderstorm",
    "Drizzle": "wi-sprinkle",
    "Rain": "wi-rain",
    "Snow": "wi-snow",
    "Mist": "wi-fog",
    "Smoke": "wi-smoke",
    "Haze": "wi-day-haze",
    "Dust": "wi-dust",
    "Fog": "wi-fog",
    "Sand": "wi-sandstorm",
    "Ash": "wi-volcano",
    "Squall": "wi-strong-wind",
    "Tornado": "wi-tornado",
    "Clear": "wi-day-sunny",
    "Clouds": "wi-cloudy"
};
const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];//array of days
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];//array of month
fetchWeatherData(default_city)//calling function to fetch default city
//Event listerner for form submission working mechanism:First when the sumbit button is pressed
//or clicked then the event listener captures that event and triggers the associated function.
//In this case, the function is an anonymous arrow function defined right there in the event listener.
//Inside this function, e.preventDefault() is called to stop the browser from performing its 
//default action of reloading the page upon form submission. This allows the script to handle 
//the form data (in this case, fetching weather data for the entered city) without losing the 
//current state of the page.
form.addEventListener("submit", (e) => {// Event Listener for Form Submission
  e.preventDefault(); // prevent page reload
//e stands for event object, which contains information about the event (like what element triggered it, default browser behavior, etc.).
  const city = Input_city.value.trim();// Get the city name from input field and trim removes the unnecessary spaces
  if (!city) return;// If input is empty, do nothing
  console.log("Searching weather for:", city); // for testing
  fetchWeatherData(city);// Call function to fetch weather data
});
// asyncronous function to fetch weather data
async function fetchWeatherData(city){
  const response = await fetch(api_url+city+`&appid=${api_key}`);//fetching the data from open weather api
  const data = await response.json();//storing response from api in data in the form of javascript object (json)
  if(data.cod =="404"){//Validating data
    location_display.textContent = "Invalid City";
    return;
  }
  Update_UI_using_data(data)//updating the UI with the data from API
}
function Update_UI_using_data(data){//Function to update Data
  location_display.textContent = data.name;//Update City Name
  actual_temp_display.textContent = Math.round(data.main.temp)+"°";//Update Temperature and math round remove the number after decimal
  const utcTime = (data.dt + data.timezone)*1000;//data.dt give current time in UNIX UTC seconds from api| data.timezone is city's timezone offset in seconds from UTC. *1000 -> converts seconds into milliseconds because Javascript date needs milliseconds.
  const Localtime = new Date(utcTime);//creates a JavaScript Date Object for local time of the city.
  const hours = Localtime.getUTCHours().toString().padStart(2,"0");//Extract Hours from the Date Object
  const minutes = Localtime.getUTCMinutes().toString().padStart(2,"0");// Extract Minutes from the Date Object.| padStart adds padding like 09:02 if not used time will be single digit number 9:2
  time_display.textContent = `${hours}:${minutes}`;//Display Time in Hour and minute
  day_display.textContent = days[Localtime.getUTCDay()];//getUTCDay returns the index of the day like 0 for Sunday
  const dayNum = Localtime.getUTCDate();//getUTCDate returns the index of the Date
  const monthName = months[Localtime.getUTCMonth()];//getUTCMonth returns the index of the Month and is reflected from the month array
  const yearShort = Localtime.getUTCFullYear().toString().slice(-2);//getUTCFullYear gets the year and toSting converts into string and slice give only two last digit
  date_display.textContent = `${dayNum} ${monthName} '${yearShort}`;//display date 
  const mainWeather = data.weather[0].main;//Gets the main weather condition and stores in mainWeather
    const iconClass = weatherIconMapping[mainWeather] || "wi-day-sunny"; //maps weather condition to weather-icon-class and "wi-day-sunny" executes if it fails and is called a fallback
  weather_icon_display.innerHTML = `<i class="wi ${iconClass}"></i>`;//Updates Icon class
  weather_condition_short_display.textContent = data.weather[0].description.toUpperCase();
  temp_max_display.textContent = Math.round(data.main.temp_max)+"°";//Update Maximum Temperature as well as rounding it up 
  temp_min_display.textContent = Math.round(data.main.temp_min)+"°"; //Update Minimum Temperature as well as rounding it up
  humidity_display.textContent = data.main.humidity+"%";// Update humidity
  wind_display.textContent = Math.round(data.wind.speed)+" km/h";//Update windspind by rounding it up
}