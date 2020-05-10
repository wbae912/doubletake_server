# Doubletake API


## Getting Started
* Clone the repository and install dependencies using ```npm install```
* Create local PostgreSQL database:
  * ```doubletake```
* Create a ```.env``` file and provide the local database locations
  * Example: ```"postgresql://dunder_mifflin@localhost/doubletake"```
* Update the database using ```npm run migrate```
* Seed the database with dummy data using ```psql -U [username] -d doubletake -f ./seeds/seed.tables.sql```
* Run the local server using ```npm run dev```


## Description
Doubletake API is the server responsible for handling API requests for the Doubletake application. The application is an item manager for users to check off items as they pack their belongings.

Client:
* Live link to application: https://doubletake.now.sh/
  * Demo username: testuser
  * Demo password: Password1!
* Link to application repository: https://github.com/wbae912/doubletake_client

Server:
* Live link to application: https://doubletake-william.herokuapp.com/
* Link to application repository: https://github.com/wbae912/doubletake_server


## Endpoints
#### Users Endpoint
* ```POST /api/users/register ``` : Endpoint for user to register and create their own account for the application. Credentials are stored in the user table in the database. Field options include:
  * email (required): User's email
  * username (required): User's desired username
  * password (required): User's desired password


#### Authorization Endpoint
* ```POST /api/auth/login``` : Endpoint used to validate a user's username and password. Returns a JWT token to authorize additional requests to the API upon successful login. Field options include:
  * username (required): User's username
  * password (required): User's password


#### General Endpoints (Protected Endpoint)
* ```GET /api/general``` : Returns an array of a user's general lists
* ```POST /api/general``` : Endpoint for user to submit their general list entry, which is stored in the database. Returns an object with the generated list. Field option(s) include:
  * title (required): Name of list

* ```GET /api/general/:id``` : Returns an object of a single general list for a user
* ```DELETE /api/general/:id``` : Endpoint for user to delete their list from the database
* ```PATCH /api/general/:id``` : Endpoint for user to edit a list


#### Event Endpoints (Protected Endpoint)
* ```GET /api/event``` : Returns an array of a user's event lists
* ```POST /api/event``` : Endpoint for user to submit their event list entry, which is stored in the database. Returns an object with the generated list. Field option(s) include:
  * title (required): Name of list
  * date_of_event (required): Date of the event
  * city (optional): City in which event occurs
  * state (optional): State in which event occurs
  * country (optional): Country in which event occurs

* ```GET /api/event/:id``` : Returns an object of a single event list for a user
* ```DELETE /api/event/:id``` : Endpoint for user to delete their list from the database
* ```PATCH /api/event/:id``` : Endpoint for user to edit a list


#### General Item Endpoints (Protected Endpoint)
* ```GET /api/generalItems``` : Returns an array of the user's general items
* ```POST /api/generalItems/:list_id``` : Endpoint for user to submit an item to a specific general list. Returns an object with the generated item. Field option(s) include:
  * item (required): Name of item
  * checked (required): Status of item (defaulted to "false")
  * quantity (required): Quantity of item (defaulted to 1)

* ```GET /api/generalItems/:list_id/:id``` : Returns an object of a single item for a user
* ```DELETE /api/generalItems/:list_id/:id``` : Endpoint for user to delete an item from the database
* ```PATCH /api/generalItems/:list_id/:id``` : Endpoint for user to edit an item


#### Event Item Endpoints (Protected Endpoint)
* ```GET /api/eventItems``` : Returns an array of the user's event items
* ```POST /api/eventItems/:list_id``` : Endpoint for user to submit an item to a specific event list. Returns an object with the generated item. Field option(s) include:
  * item (required): Name of item
  * checked (required): Status of item (defaulted to "false")
  * quantity (required): Quantity of item (defaulted to 1)

* ```GET /api/eventItems/:list_id/:id``` : Returns an object of a single item for a user
* ```DELETE /api/eventItems/:list_id/:id``` : Endpoint for user to delete an item from the database
* ```PATCH /api/eventItems/:list_id/:id``` : Endpoint for user to edit an item


#### Search Endpoint (Protected Endpoint)
* ```GET /api/search/:listType``` : Returns a general or event list that the user searches for via query


#### Weather Endpoint (Protected Endpoint)
* ```GET /api/weather``` : Returns an array of weather data for the location of the user's event via query

#### Third-Party APIs (Used in the Weather Endpoint)

##### Mapquest API Endpoint
* Link to TMDb API: http://www.mapquestapi.com

* ```GET /geocoding/v1/address``` : Returns an array of geocoding data based on the a query parameter (location). This API was leveraged in order to obtain the latitude and longitude to use for the Weather API below.


##### Open Weather Map API Endpoint
* Link to TMDb API: https://api.openweathermap.org

* ```GET /data/2.5/weather``` : Returns an array of weather data based on the following query parameters obtained from the Mapquest API:
  * latitude
  * longitude


## Technologies
* NodeJS
* Express
* PostgreSQL