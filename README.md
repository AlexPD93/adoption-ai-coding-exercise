# AI Use Case Tracker

A small app for authoring and managing AI use-cases, built with Express, SQLite, and vanilla JavaScript.

Start with [`BRIEF.md`](./BRIEF.md) — it describes the task and what to build.

## Quick Start (TypeScript)

1. **Install dependencies:**
   ```bash
   cd typescript
   npm install
   ```

2. **Start the server:**
   ```bash
   npm run dev
   ```
   The app will be running at [http://localhost:3000](http://localhost:3000).

3. **Seed the database:**
   In a separate terminal, run:
   ```bash
   ./scripts/populate.sh http://localhost:3000
   ```

4. **Running tests:**
   ```bash
   cd typescript
   npm test
   ```

## Helper Scripts

Located in `scripts/`, these use the running API:

- `./scripts/populate.sh [base-url]` — Seeds the database with 9 example use cases.
- `./scripts/cleanup.sh [base-url]` — Deletes every use case.

*Note: For this TypeScript project, always pass `http://localhost:3000` to these scripts.*

## Layout

- `BRIEF.md`: The task description.
- `typescript/`: Express + SQLite + vanilla JS starter.
  - `/src/`: Server and database logic.
  - `/public/`: Frontend assets.
  - `/test/`: Unit and integration tests.
- `scripts/`: Seed and cleanup helper scripts.
