# Weather App
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/Sandesh-Basnet/Weather_APP)

This is a dynamic weather application developed as a university assignment. It fetches and displays real-time weather data for cities around the world, featuring a clean user interface and a caching backend to optimize API usage.

## Features

*   **Real-Time Weather Data**: Displays current temperature, weather conditions (e.g., "Thunderstorm", "Clear"), humidity, and wind speed.
*   **City Search**: Allows users to search for any city to get its latest weather information.
*   **Dynamic UI**: The weather icon and background adapt to the current weather conditions.
*   **Detailed Information**: Provides max/min temperatures for the day.
*   **Timezone-Aware**: Automatically calculates and displays the correct local time and date for the searched city.
*   **Backend Caching**: Utilizes a PHP backend with a MySQL database to cache API responses for one hour, reducing redundant calls to the OpenWeatherMap API.

## Tech Stack

*   **Frontend**: HTML, CSS, JavaScript
*   **Backend**: PHP
*   **Database**: MySQL
*   **API**: [OpenWeatherMap API](https://openweathermap.org/api)

## Architecture

The application consists of a frontend client and a backend proxy server.

1.  **Frontend (Client)**: The user interacts with the `main.html` page. The `script.js` file handles user input and UI updates. When a user searches for a city, a `fetch` request is sent to the local PHP backend.
2.  **Backend (Server)**: The `weather.php` script acts as a proxy and caching layer.
    *   It receives the city name from the frontend.
    *   It connects to a local MySQL database (`weather_db`) and checks for a valid, non-expired (less than 1 hour old) cached record for the city.
    *   **Cache Hit**: If a recent record is found, it is returned directly to the client.
    *   **Cache Miss**: If no recent record exists, the script calls the external OpenWeatherMap API to fetch new data. This new data is then stored in the database for future requests and sent back to the client.

This architecture minimizes direct calls to the external API, improving performance and avoiding rate limits.

### UML Diagrams

The repository includes several diagrams that visualize the application's structure and flow:

*   **`Activity Diagram`**: Outlines the flow of activities from the user's perspective, from launching the app to viewing weather data.
*   **`Deployment Diagram.drawio`**: Describes the physical deployment of the components, including the client device, the local web server, and the external API server.
*   **`Seqeuntial Diagram.drawio`**: Details the sequence of interactions between the user, the UI, the JavaScript client, and the backend services for a weather data request.

## Local Setup and Installation

To run this project on your local machine, follow these steps:

### Prerequisites

*   A local web server environment like [XAMPP](https://www.apachefriends.org/) or [WAMP](https://www.wampserver.com/en/) that includes Apache, PHP, and MySQL.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/sandesh-basnet/weather_app.git
    ```

2.  **Configure the Server:**
    *   Move the cloned project folder into your web server's root directory (e.g., `htdocs` in XAMPP).
    *   Start the Apache and MySQL services from your server's control panel.

3.  **Database Setup:**
    *   The backend script (`weather.php`) is designed to automatically create the `weather_db` database and the `weather_data` table on its first run.
    *   Ensure the MySQL user credentials in `weather.php` (default: `user="root"`, `pass=""`) match your local setup and have the necessary permissions to create databases and tables.

4.  **Run the Application:**
    *   Open your web browser and navigate to the `main.html` file through your local server. For example:
      ```
      http://localhost/weather_app/main.html
      ```

> **Note**: The API endpoint in `script.js` is configured as `http://localhost/weather.php/`. If you place `weather.php` inside the project folder (e.g., `weather_app/weather.php`), you will need to update this URL to `http://localhost/weather_app/weather.php`.
