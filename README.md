# Node JS / Express / Mongo DB API

RESTful API built on top of Node JS, Express and Mongo DB that handles users (sign up, login, logout, authentication) and tasks (ass tasks, edit tasks, delete tasks, auth protection).

## Development instructions

- Clone this repo
- Run `yarn` or `yarn install` to install libraries/dependencies
- Create a file `./config/dev.env` with the next environment variables
  - **PORT**: Default port that the API will run into
  - **MONGODB_URL**: Your local/development Mongo DB URL
  - **JWT_SECRET**: Hash/Secret to generate and verify JSON Web Tokens for authentication
- Run `yarn dev` to fire up a dev server.
