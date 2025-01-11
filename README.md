# postfoo-server

PostFoo helps you keep track of your finances and information for you and your family

This is deployed @ [gql.postfoo.com](https://gql.postfoo.com) and client at [postfoo.com](https://postfoo.com)

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


### Deployments

Deployments are done manually by triggering the [Deploy script](https://github.com/umakantp/postfoo-client/actions/workflows/merge-dev-to-main.yml).


### Coding guidelines

Generally reading the code should get you the gist of what are the general guidelines. But there has to be some proper documentation in place soon.


### TODO

- [ ] Add a proper code documentation & project structure
- [ ] Add a prettier
- [ ] Fix the eslint config to add more general rules
