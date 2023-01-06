# RSSchool NodeJS HTTP task - CRUD API

* Implements https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md
* Server is started on localhost
* Data is stored in-memory-database and is cleared after each restart

### Endpoints
- **GET** `api/users`
- **GET** `api/users/${userId}` 
- **POST** `api/users`
- **PUT** `api/users/{userId}`
- **DELETE** `api/users/${userId}`

### User record
- `id` — unique identifier (`string`, `uuid`) generated on server side
- `username` — user's name (`string`, **required**)
- `age` — user's age (`number`, **required**)
- `hobbies` — user's hobbies (`array` of `strings` or empty `array`, **required**)

## Installation
1. Clone/download repo
2. `npm install`

## Usage

**Config**

* Default PORT is 4000
* To change default port rename .env.example to .env and set PORT in it

**Development**

`npm run start:dev`

* Server started in development mode @ `http://localhost:PORT` with nodemon

**Production**

`npm run start:prod`

* Starts the build process
* Server from budled file started in production mode @ `http://localhost:PORT` without nodemon

**Milti**

`npm run start:multi`

* Primary server started @ `http://localhost:PORT`
* Workers started @ `http://localhost:<PORT+1>`, `http://localhost:<PORT+2>` ..., number of workers equal to the number of logical processor cores on the host machine
* All requests should be done via Primary.

## Testing

**Commands**

`npm run test` runs all tests, no need to run server, it will be imported in test and run in single-mode.

`npm run test:coverage` same, with coverage report.

If you want to test by http you have to start server (single or multi) and then use `npm run test:server` command. For Windows there are 2 cmd-files (`test.server.cmd` and `test.server.multi.cmd`) making this.

**Scenarios**
* `example.test` - example test from assignment
* `bad.test` - all types of errors
* `app.test` - advanced test scenario with multiples objects created/updated/deleted
