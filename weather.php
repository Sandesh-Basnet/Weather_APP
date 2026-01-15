<?php
//Author: Sandesh Basnet
//Github: @Sandesh-Basnet
//TryHackMe: @Kastra
header("Access-Control-Allow-Origin: *");// Allow requests from any origin
header("Content-Type: application/json");// Set content type to JSON
mysqli_report(MYSQLI_REPORT_OFF);// Disable MySQLi error reporting
if(isset($_GET["city"])){// Check if 'city' parameter is provided in the URL
    $city = urldecode($_GET["city"]);// Decode the city name from URL
} else {
    $city = 'East Yorkshire';// Default city if none provided
}
$host = "localhost";
$user = "root";
$pass = "";
$conn = mysqli_connect($host, $user, $pass);// Connect to MySQL database
if (!$conn){// Check connection
    die("". mysqli_connect_error());// Handle connection error
}
// echo "Connection Successfull";
$create_db = "CREATE DATABASE IF NOT EXISTS weather_db";// Create database if it doesn't exist
$database = mysqli_query($conn, $create_db);// Execute database creation query
if (!$database){// Check if database creation was successful
    die("Error creating database: ". mysqli_error($conn));// Handle database creation error
}
// echo 'Database created successfully';
mysqli_select_db($conn, 'weather_db');// Select the created database
$create_table = "CREATE TABLE IF NOT EXISTS weather_data(
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    temperature FLOAT NOT NULL,
    dt INT NOT NULL,
    timezone INT NOT NULL,
    weather_main VARCHAR(50) NOT NULL,
    weather_description VARCHAR(50) NOT NULL,
    max_temp FLOAT NOT NULL,
    min_temp FLOAT NOT NULL,
    humidity INT NOT NULL,
    wind_speed FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";// Create table if it doesn't exist
$create_table = mysqli_query($conn, $create_table);// Execute table creation query
if (!$create_table){// Check if table creation was successful
    die("Error creating table: ". mysqli_error($conn));// Handle table creation error
}
// echo "Table created successfully";
$select = "SELECT * FROM weather_data WHERE city_name='$city' AND created_at >= NOW() - INTERVAL 1 HOUR";// Select query to check for existing data within the last hour
$result = mysqli_query($conn, $select);// Execute select query
if(mysqli_num_rows($result)===0){// If no recent data found, fetch new data from API
    $api_url = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=' . urlencode($city) . '&appid=667d22c72d4ce8cfa3b87c113bb900a6';// OpenWeatherMap API URL.Urlencode used to handle spaces and special characters in city names
    $data = file_get_contents($api_url);// Fetch data from the API
    // print_r($data);
    $data_decode = json_decode($data, true);// Decode JSON response into associative array
    if (!isset($data_decode['cod']) || $data_decode['cod'] != 200) {// Check if API response is valid
    echo json_encode(["error" => "City not found"]);// Return error if city not found
    exit;// Exit script
    }
    // print_r($data_decode);
    $city_name = $data_decode['name'];
    $temperature = $data_decode['main']['temp'];
    $dt = $data_decode['dt'];
    $timezone = $data_decode['timezone'];
    $weather_main = $data_decode['weather'][0]['main'];
    $weather_description = $data_decode['weather'][0]['description'];
    $max_temp = $data_decode['main']['temp_max'];
    $min_temp = $data_decode['main']['temp_min'];
    $humidity = $data_decode['main']['humidity'];
    $wind_speed = $data_decode['wind']['speed'];
    //Extract the data from the API response
    $insert = "INSERT INTO weather_data (city_name, temperature, dt, timezone, weather_main, weather_description, max_temp, min_temp, humidity, wind_speed) VALUES ('$city_name', $temperature, $dt, $timezone, '$weather_main', '$weather_description', $max_temp, $min_temp, $humidity, $wind_speed)";
    // Insert query to store fetched data into the database
    $insert_query = mysqli_query($conn, $insert);// Execute insert query
    if (!$insert_query){// Check if insert was successful
        die("Error inserting data: ". mysqli_error($conn));// Handle insert error
    }
}
$result = mysqli_query($conn,$select);// Re-execute select query to get the latest data
$rows = mysqli_fetch_assoc($result);// Fetch the data as an associative array
if (!$rows) {// Check if data is available
    echo json_encode(["error" => "No data available"]);// Return error if no data found
    exit;// Exit script
}
echo json_encode($rows);// Return the data as JSON response
// print_r($rows);
?>
