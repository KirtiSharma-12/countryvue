### Country Management
This is a full-stack web application that allows users to view a list of countries, select a specific country to view its details, and add a new country to the list.

**Features**
 1. View List of Countries: The application displays a list of countries fetched from the server.
 2. View Country Details: Users can select a country from the list to view its details, including the country name, rank, and an image of the country flag.
 3. Add a New Country: Users can add a new country to the list by providing the country name, continent, rank, and uploading an image of the country flag.

**Technologies Used**
 - Frontend: Vue.js
 - Backend: Node.js, Express.js
 - Data Storage: JSON file
 - File Storage: Local file system
 - CSS Framework: Custom CSS

**Project Structure**
The project is structured as follows:
  ```
   countryvue/
   ├── index.js (backend entry point)
   ├── data.json (JSON file storing the country data)
   ├── public/          -- Maintain all files under this folder
   │     ├── images/ (directory for storing country flag images)
   │     ├── app.js (frontend Vue.js application)
   │     ├── index.html (HTML template for the Vue.js application)
   │     ├── styles.css (CSS styles for the application)
   └── README.md (this file)
  ```

**Installation and Setup**

 1. Clone the repository:
    ```sh
    clone https://github.com/KirtiSharma-12/countryvue.git
    ```
 2. Navigate to the project directory:
    ```sh
    cd countryvue
    ```
 3. Install the dependencies:
    ```sh
    npm install
    ```
 4. Start the development server:
    ```sh
    node index.js
    ```
 5. Open the application in your web browser:
    ```sh
    http://localhost:8080
    ```

**Usage**
 1. View List of Countries: The application will display a list of countries fetched from the server.
 2. View Country Details: Select a country from the dropdown to view its details, including the country name, rank, and an image of the country flag.
 3. Add a New Country: Click the "Add a New Country" section to fill out the form and add a new country to the list.
