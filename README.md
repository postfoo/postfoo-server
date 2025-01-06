# postfoo-server

PostFoo is project for tracking personal portfolio

Deployed @ [gql.postfoo.com](https://gqp.postfoo.com)

### Setup

- Start the Postgres Database in [Docker](https://www.docker.com/get-started):

  ```sh
  docker-compose up -d
  ```

- Run the first build & deploy the db:

  ```sh
  npm install
  cp .env.example .env
  npm run build
  npm run db:deploy
  ```

- Run the server:

  ```sh
  npm run dev
  ```

### Environment Variables

The repo has a file called `.env.example` for sample env variables. Copy the values from `.env.example` to `.env` and change the values as needed.

Note: Generally for local development, you not need to change anything in the `.env` file.

## Migrations

### Creating a new migration

- Make changes to [prisma/schema.prisma](prisma/schema.prisma)
- Run `npm run db:migrate`
- You can use `npm run db:migrate:dryrun` to just see the SQL before running it.

## Deployment

### Deploying to dev

TODO

### Deploying to prod

TODO
