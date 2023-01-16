# RSSchool NodeJS HTTP task - CRUD API

* Implements https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md
* Server is started on localhost
* Data is stored in-memory-database and is cleared after each restart

### Endpoints
- **GET** `api/users` - returns all users data + code 200 (if all is ok, same below)
- **GET** `api/users/${userId}` - get one existing user data + code 200
- **POST** `api/users` - create new user (data taken from request body), generate id, return new user data + code 201
- **PUT** `api/users/${userId}` - update existing user data (data taken from request body), return updated user data + code 200
- **DELETE** `api/users/${userId}` - delete existing user, return code 204

#### Endpoint validation
- Calling wrong method on existing endpoint results as 404, as it's written in assignment
- Don't use ending slashes in URLs, it results as 404

### User record
- `id` — unique identifier (`string`, `uuid`) generated on server side
- `username` — user's name (`string`, **required**)
- `age` — user's age (`number`, **required**)
- `hobbies` — user's hobbies (`array` of `strings` or empty `array`, **required**)

#### Data validation
- userId have to be valid uuidv4 (for GET user, PUT user, DELETE user endpoints)
- request body have to be valid json-encoded string, data have to be _complete user record_ except `id` field (partial update e.g. PATCH is not allowed), additional fields are not allowed (for POST user, PUT user).

## Installation
1. Clone/download repo
2. Switch to develop branch `git checkout -b develop origin/develop`
3. `npm install`

## Usage

#### Config
* Default PORT is 4000
* To change default port rename .env.example to .env and set PORT in it

#### Development
`npm run start:dev`

* Server started in development mode @ `http://localhost:PORT` with nodemon

#### Production

`npm run start:prod`

* Starts the build process
* Server from budled file started in production mode @ `http://localhost:PORT` without nodemon

#### Multi

`npm run start:multi`

* Primary server started @ `http://localhost:PORT`
* Workers started @ `http://localhost:<PORT+1>`, `http://localhost:<PORT+2>` ..., number of workers equal to the number of logical processor cores on the host machine
* All requests should be done via Primary.

## Testing

#### Commands

* `npm run test` runs all tests, no need to run server, it will be imported in test and run in single-mode.
* `npm run test:coverage` same, with coverage report.
* If you want to test by http you have to start server (single or multi) and then use `npm run test:server` command. For Windows there are 2 cmd-files (`test.server.cmd` and `test.server.multi.cmd`) making this.

#### Scenarios
* `example.test` - example test from assignment
* `bad.test` - all types of errors
* `app.test` - advanced test scenario with multiples objects created/updated/deleted
