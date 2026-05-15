# AI Use Case Tracker

Take-home starter for the Multiverse interview. A small app for authoring and managing AI use-cases (title, body, AI tool, time saved).

Start with [`BRIEF.md`](./BRIEF.md) — it describes the task and what to build.

## Pick a stack

Both starters are equivalent. Use whichever you're more comfortable with.

- [`python/`](./python) — FastAPI + SQLite + vanilla JS. Run on `http://localhost:8000`.
- [`typescript/`](./typescript) — Express + SQLite + vanilla JS. Run on `http://localhost:3000`.

Each subdirectory has its own README with setup and run instructions.

## Helper scripts

`scripts/` contains two helpers that hit the running API:

- `./scripts/populate.sh [base-url]` — seeds the database with 9 example use cases.
- `./scripts/cleanup.sh  [base-url]` — deletes every use case.

Default base URL is `http://localhost:8000`. Pass `http://localhost:3000` for the TypeScript stack.

## Layout

```
BRIEF.md           the task
python/            FastAPI starter
typescript/        Express starter
scripts/           seed + cleanup helpers
```
