# kinja-events Middleware
Receives a data from a 3rd party service, transforms the data to a the kinja-events format, and pushes it to firebase.

## Usage

`npm start` will start the server on port `5000`.

### API

- `POST` - `/api/event`
- `GET`  - `/api/sync`
- `GET`  - `/test/insert-mock-data`

## Deploy to Heroku

> Setup heroku if you havven't already. [See the guide here](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up)

Push your changes to heroku master
`git push heroku master`
