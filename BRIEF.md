# AI Use Case Tracker — Take-home

## Context

One of the products at Multiverse is an app that teaches clients how best to use AI in their work via shortform use-cases. We have an internal app where these use-cases are authored and managed. Your task is to extend the app with some extra functionality. Feel free to use as much or as little AI assistance as you want.

The starter you've been given is the very first cut: it works, but it was shipped fast and rough. The authors who use it daily are running into the gaps.

## Task 

Add a small "stats" view to the app:

- **Total time saved** across all use cases.
- **Count + total time saved per AI tool** (e.g. `Claude — 7 use cases, 230 min`).

## Time

Aim for **1–2 hours**. We'd rather see a tight, focused submission than a sprawling one. If you find yourself going much beyond that, stop and write a short note about what you'd have done next.

## Stack

Pick **one** of:

- `python/` — FastAPI + SQLite + vanilla JS
- `typescript/` — Express + SQLite + vanilla JS

Both starters are equivalent. Use whichever you're more comfortable with. See the README inside the directory you choose for run instructions.

## What's already there

- Three screens: **list**, **view**, **create**.
- A use case has four fields: **title**, **body**, **AI tool used**, **time saved (in minutes)**.
- A SQLite database, served by a single process.

A use case looks roughly like this:

> **Title:** Drafting weekly status updates
> **AI tool:** Claude
> **Time saved:** 30
> **Body:** I used to spend 30–40 minutes every Friday gathering notes from Slack and meetings to write my status update. Now I paste my raw notes into Claude with a template prompt and edit the result. Cut the chore down to 10 minutes.

## Scripts

Two helper scripts live in `scripts/`. They use the API, so the server must be running first.

- `./scripts/populate.sh` — seeds the database with 9 example use cases.
- `./scripts/cleanup.sh` — deletes every use case.

Both default to the server at `http://localhost:8000`. Pass the base URL as an argument to point them elsewhere:

```sh
./scripts/populate.sh http://localhost:3000   # typescript
./scripts/cleanup.sh  http://localhost:3000
```