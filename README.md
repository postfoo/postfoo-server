# postfoo-server

PostFoo helps you keep track of your finances and information for you and your family

This is deployed @ [gql.postfoo.com](https://gql.postfoo.com) and [client](https://github.com/umakantp/postfoo-client) at [postfoo.com](https://postfoo.com)

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

### Directory structure

```
postfoo-client
├── .github (GitHub actions)
├── .vscode (VS Code editor settings)
├── bin (scripts)
│   └── data (for data population/maniputlation)
├── dist (Build output)
├── node_modules (Dependencies)
├── prisma (Prisma schema, config & migrations)
├── .env (Environment variables)
├── .env.example (Sample environment variables to get started)
├── .gitignore (Files to ignore)
├── .nvmrc (Node version for nvm/project)
├── codegen.yml (GraphQL codegen config)
├── docker-compose.yml (Docker config for local db)
├── eslint.config.mjs (ESLint config)
├── package.json
├── README.md
└── src
    ├── @types (Types for libraries & ts-reset)
    ├── db (Database client, seeds & middlewares)
    ├── graphql (Holds each schema's permissions, resolvers & types.)
    ├── integrations (Any third party integrations like SMS, Stripe, etc.)
    ├── models (Schema models for prisma)
    ├── types
    │   ├── graphql.ts (Generated types from graphql codegen)
    │   ├── resolvers.ts (Generated resolvers types from graphql codegen)
    │   └── index.ts (Reexports all the types from graphql & resolvers..etc.)
    └── utils
        ├── crypto.ts (encryption & decryption helper functions)
        ├── errors.ts (Common error helper functions & sentry logger)
        ├── honeypot.ts (Honey pot attack config, helper functions)
        ├── jwt.ts (JWT token helper functions)
        ├── pkg.ts (Reading package.json)
        ├── logger.ts (Logging the info, error, warn, etc.)
        ├── sentry.ts (Sentry config, initalization)
        └── utils.ts (Reusable helper functions)
```

### TODO

- [ ] Add a prettier
