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
* Live link to application repository:
* Live link to application:
  * Demo username: testuser
  * Demo password: Password1!

Server:
* Live link to application repository:
* Live link to application:
  * Demo username: testuser
  * Demo password: Password1!


## Endpoints
#### TV Endpoints (All endpoints are protected)
* ```GET /api/shows/all``` : Returns an array of a specific user's TV show entries
* ```POST /api/shows/all``` : Endpoint for user to submit their TV show entry, which is saved in the database. Returns an object with the TV show's properties. Field options include:
  * tv_title (required): Name of TV show
  * status (required): Status of TV show ("Planning to Watch", "Currently Watching", "Completed")
  * season_number: Season number for a TV show
  * episode_number: Episode number for a TV show
  * rating: Rating of the TV show
  * genre: Genre of the TV show
  * description: description of the TV show
  * review: review of the TV show

* ```GET /api/shows/all/:id``` : Returns an object of a single TV show entry for a specific user
* ```DELETE /api/shows/all/:id``` : Endpoint for user to delete their TV show entry from the database
* ```PATCH /api/shows/all/:id``` : Endpoint for user to edit their specific TV show entry 


#### Users Endpoint
* ```POST /api/users ``` : Endpoint for user to register and create their own account for the application. Credentials are stored in the users table in the database. Field options include:
  * full_name (required): User's full name
  * user_name (required): User's desired username
  * password (required): User's desired password


#### Authorization Endpoint
* ```POST /api/auth/login``` : Endpoint used to validate a user's username and password. Returns a JWT token to authorize additional requests to the API upon successful login. Field options include:
  * user_name (required): User's username
  * password (required): User's password


#### Technologies
* NodeJS
* Express
* PostgreSQL