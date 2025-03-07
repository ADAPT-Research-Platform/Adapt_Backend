
---

## Overview

The main goal of this repository is to set up an Express REST API for the ADAPT App.

We’ve implemented end-to-end tests, and the code coverage is 100%.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [API Routes](#api-routes)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [Migrations](#migrations)
- [Subscribers](#subscribers)
- [E2E Tests](#e2e-tests)
- [Logging](#logging)
- [Existing Routes](#existing-routes)
- [Common Errors](#common-errors)
- [Clean GitHub Templates and Workflows](#clean-github-templates-and-workflows)
- [Upcoming Features](#upcoming-features)
- [Further Documentation](#further-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Getting Started

### Step 1: Set up the Development Environment

Before we can do anything, we need to set up the development environment.

#### Install [Node.js and NPM](https://nodejs.org/en/download/)

- On macOS, use [Homebrew](http://brew.sh): `brew install node`
- On Windows, use [Chocolatey](https://chocolatey.org/): `choco install nodejs`

#### Install Yarn globally

```bash
npm install --global yarn
```

#### Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

- Install Docker Desktop
- Ensure Docker Desktop is running

### Step 2: Clone the project

```bash
git clone https://github.com/BinayakAdhikari/adaptNodeBE
cd adaptNodeBE
rm -rf .git # On Windows, use rd /s /q .git
yarn install
```

The command `rm -rf .git` (or `rd /s /q .git` on Windows) removes the git metadata, such as history.

### Step 3: Copy the `.env.example` file

- On macOS, run `cp .env.example .env`
- On Windows, run `copy .env.example .env`

### Step 4: Run the server

```bash
yarn docker:up
yarn dev
```

This starts a local server using `nodemon`, which watches for any file changes and restarts the server accordingly. The server will be available at `http://0.0.0.0:8000` (or `http://localhost:8000`).

### Step 5: Test the server

To test the server, query `http://localhost:8000/api/health` using [Postman](https://www.postman.com/) or paste the URL into your browser. If the server is running, you should see `Server is up!`.

### Step 6: Create the `user` database table

To create the `user` table, run the migration script:

```bash
yarn migration:run
```

---

## Scripts

⚠️ Except for Docker-related scripts, all scripts must be executed from within the `api` container shell.

### Docker

- `yarn docker:up`: Starts the containers defined in `docker-compose.yml`. This also opens a shell in the `api` container, where other scripts can be run.
- `yarn docker:down`: Stops the running containers.
- `yarn docker:shell`: Opens a shell in the `api` container.
- `yarn docker:build`: Builds a Docker image of the API.

### Install

- Install all dependencies with `yarn install`.

### Running in Development Mode

- `yarn dev`: Starts the app using [nodemon](https://www.npmjs.com/package/nodemon) with `ts-node`. By default, the server runs on `http://0.0.0.0:8000` (or `http://localhost:8000`).

### Build

- `yarn build`: Compiles the project into the `build/` directory.
- `yarn start`: Runs the compiled project.
- `yarn type-check`: Performs type checking.

### Migrations

- `yarn migration:run`: Executes pending migrations.
- `yarn migration:generate MigrationName`: Generates a migration based on changes in entities.
- `yarn migration:create MigrationName`: Creates an empty migration.
- `yarn migration:revert`: Reverts the last migration (run multiple times to revert multiple migrations).

### Linting

- `yarn lint`: Analyzes code quality using ESLint, displaying warnings and errors.
- `yarn lint:fix`: Fixes fixable warnings and errors.

### Tests

- `yarn test`: Runs all tests.
- `yarn test:coverage`: Runs tests and generates a coverage report.

---

## API Routes

By default, all routes are prefixed with `/api`, but this can be configured in the `.env` file.

| Route                       | Method | Description                    |
|-----------------------------|--------|--------------------------------|
| **/api/health**             | GET    | Returns `Server is up!`       |
| **/api/users**              | POST   | Creates a user                 |
| **/api/auth/login**         | POST   | Logs a user in                 |
| **/api/auth/logout**        | POST   | Logs a user out                |
| **/api/auth/authenticated** | GET    | Returns authentication status  |

---

## Project Structure

| Name                        | Description                                |
|-----------------------------|--------------------------------------------|
| **__tests__/**              | Contains all tests                        |
| **__tests__/e2e/**          | End-to-end tests                          |
| **__tests__/utils/**        | Utilities for testing                     |
| **@types/**                 | Global type definitions                   |
| **build/**                  | Compiled source files                     |
| **coverage/**               | Jest coverage reports                     |
| **src/**                    | Source code                               |
| **src/config/**             | Configuration files                       |
| **src/controllers/**        | API controllers                           |
| **src/entities/**           | TypeORM entities                          |
| **src/migrations/**         | Migration files                           |
| **src/routes/**             | API route definitions                     |
| **src/types/**              | TypeScript type definitions               |
| **src/utils/**              | Utility functions                         |
| **src/data-source.ts**      | TypeORM data source configuration          |
| **src/tracks_controller.ts**            | Application entry point                   |

---

## Environment Variables

| Name                | Description                                     | Optional | Default Value |
|---------------------|-------------------------------------------------|----------|---------------|
| NODE_ENV            | Environment type (e.g., production, development)| ✔️       |               |
| HOST                | Server host                                     | ✔️       | `0.0.0.0`     |
| PORT                | Server port                                     | ❌       |               |
| DB_USER             | Database username                               | ❌       |               |
| DB_HOST             | Database host                                   | ❌       |               |
| DB_NAME             | Database name                                   | ❌       |               |
| DB_PASSWORD         | Database password                               | ❌       |               |
| DB_PORT             | Database port                                   | ❌       |               |
| CORS_ORIGIN_ALLOWED | Allowed CORS origins                            | ✔️       |               |

---
