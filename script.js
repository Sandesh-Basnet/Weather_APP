const api_key = "1a988c5549b766ca3fdc02ac928f78cd";// OpenWeatherMap API Key
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
const default_city = "East Riding of Yorkshire"//default city according to city sheet sent in MST

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
  console.log(data)//for testing
}










