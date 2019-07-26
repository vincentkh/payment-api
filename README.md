# Payment API

## How to run project locally

- Clone repo
- `npm i` in root directory
- `npm start` to run nodemon in watch mode (http://localhost:3000)

## How to access database

> I have created a mongodb instance on [clever-cloud](https://www.clever-cloud.com).\
> You can find the credentials in `secrets.js`

## How to test the API

- I recommend using [insomnia](https://insomnia.rest) instead of [postman](https://www.getpostman.com), I am sure you will love it
- Just install it and import the [workspace](docs/Insomnia_2019-07-26.json)
- [How to import in insomnia](docs/how-to-import-workspace.png)

## Overview of auth system

1. Password is `hashed` and `salted` with [bcrypt](https://www.npmjs.com/package/bcryptjs) and is stored in database
2. User enters credentials, server validates credentials. If valid, a random 16 byte token is generated and stored in database along with the user ID of the requesting user
3. Token is returned in `/v1/authentication` response body as `authToken`
4. Client should send the token in `Authorization` request header
5. Each other request is authenticated by a middleware