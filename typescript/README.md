# TypeScript starter — AI Use Case Tracker

Express + SQLite + vanilla JS. Single process serves both the API and the static UI.

## Setup

```sh
npm install
```

## Run

```sh
npm run dev
```

Then open <http://localhost:3000>.

## Layout

```
src/server.ts      Express app and routes
src/db.ts          SQLite connection and schema
public/            HTML, CSS, JS served by the same process
  index.html
  app.js
  style.css
usecases.db        SQLite file (created on first run)
```

## Tests

`vitest` is installed but there are no tests yet. Run them with:

```sh
npm test
```
