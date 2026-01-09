<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
mysqli_report(MYSQLI_REPORT_OFF);
if(isset($_GET["city"])){
    $city = ($_GET["city"]);
} else {
    $city = 'East Riding of Yorkshire';
}
$host = "localhost";
$user = "root";
$pass = "";
$conn = mysqli_connect($host, $user, $pass);
if (!$conn){
    die("". mysqli_connect_error());
}
// echo "Connection Successfull";
$create_db = "CREATE DATABASE IF NOT EXISTS weather_db";
$database = mysqli_query($conn, $create_db);
if (!$database){
    die("Error creating database: ". mysqli_error($conn));
}
// echo 'Database created successfully';
mysqli_select_db($conn, 'weather_db');
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
)";
$create_table = mysqli_query($conn, $create_table);
if (!$create_table){
    die("Error creating table: ". mysqli_error($conn));
}
// echo "Table created successfully";
$select = "SELECT * FROM weather_data WHERE city_name='$city' AND created_at >= NOW() - INTERVAL 1 HOUR";
$result = mysqli_query($conn, $select);
if(mysqli_num_rows($result)===0){
    $data = file_get_contents('https://api.openweathermap.org/data/2.5/weather?units=metric&q='.$city.'&appid=667d22c72d4ce8cfa3b87c113bb900a6');
    // print_r($data);
    $data_decode = json_decode($data, true);
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
    $insert = "INSERT INTO weather_data (city_name, temperature, dt, timezone, weather_main, weather_description, max_temp, min_temp, humidity, wind_speed) VALUES ('$city', $temperature, $dt, $timezone, '$weather_main', '$weather_description', $max_temp, $min_temp, $humidity, $wind_speed)";
    $insert_query = mysqli_query($conn, $insert);
    if (!$insert_query){
        die("Error inserting data: ". mysqli_error($conn));
    }
}
$result = mysqli_query($conn,$select);
$rows = mysqli_fetch_assoc($result);
echo json_encode($rows);
// print_r($rows);
?>