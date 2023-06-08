# AnkoraNxSetup

Before you start any of the commands you need to run `npm install` to install all the packages that are used throughout the application.

## Migrations

To run the migrations you need to run the following command: `npm run db:migrate` and after that to sync it with your prisma client `npm run db:client:generate`. And if you want to create a new migration when you add a new model to the schema.prisma file or change a current model you need to create a new migration with the following command: `npm run db:migrate:generate 'name of the migration' `, and run the command to sync with the prisma client as mentioned above.

## Backend

To start backend you need to run the following command: `npm run dev:api`. When you create a new route in the controller or change a current one you need to run the following command: `npm run api:client:generate`. It will generate custom calls for the database that you can use on the frontend part, for example `await apiClient.user.saveUser({ requestBody });`

## Libraries

The project has a couple of custom libraries that we can use on backend and frontend, they are: api-client, common, config, core, firebase, models, repository, ui-library.
`Api-client:`
Api-client is used to generate the apiClient calls that we use on client components, common has decorators, helpers, pipes etc.
`Config:`
Config is used to define what environment to use and what atributes and credentials each environment has
`Firebase:`
Firebase has the connection to the firebase server and custom functions to connect to the mentioned server depending on what we want to to with the server.
`Models:`
Models has every prisma model that we use in the database, repository library has repositories for every model so we can easier get data from the database on server side components, on client side components we need to use apiClient, `Ui-library `
Ui-library has ui-components that we use on frontend.

## Frontend

To start the app we need to run the following command `npm run dev:app`. The hierarchy of the components is as follows: components that contain elements modules and wrappers, constants where some constants are defined that we use throughout the app, and lib that is used to define the token and config for the app and the creation of the apiClient that is used to fetch data from backend on client side components.

## Docker

You need to make sure that you run docker server on your machine. You need to enter /packages/api and run the following command `docker compose up postgres`.
