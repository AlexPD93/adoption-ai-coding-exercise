#!/usr/bin/env bash
# Populate the API with 9 example use cases. The server must be running.
#
# Usage:
#   ./scripts/populate.sh                          # http://localhost:8000 (python default)
#   ./scripts/populate.sh http://localhost:3000    # typescript default
set -euo pipefail

BASE_URL="${1:-http://localhost:8000}"

if ! curl -sf "$BASE_URL/api/usecases" > /dev/null; then
    echo "Cannot reach $BASE_URL. Is the server running?" >&2
    exit 1
fi

post() {
    curl -sf -X POST "$BASE_URL/api/usecases" \
        -H 'Content-Type: application/json' \
        -d "$1" > /dev/null
}

post '{
    "title": "Drafting weekly status updates",
    "body": "I used to spend 30-40 minutes every Friday gathering notes from Slack and meetings to write my status update. Now I paste my raw notes into Claude with a template prompt and edit the result. Cut the chore down to 10 minutes.",
    "ai_tool": "Claude",
    "time_saved_minutes": 30
}'

post '{
    "title": "Generating SQL from plain English",
    "body": "Our analytics dashboard needs ad-hoc queries all the time. I describe what I want in a sentence and ChatGPT writes the SQL against our schema. I still review every query before running it, but the first draft is usually 90% there.",
    "ai_tool": "ChatGPT",
    "time_saved_minutes": 20
}'

post '{
    "title": "Turning meeting transcripts into action items",
    "body": "Otter.ai records the call and produces a transcript. I feed that into Claude with a prompt asking for decisions, owners, and dates. Used to spend an hour after every workshop writing this up by hand.",
    "ai_tool": "Otter.ai + Claude",
    "time_saved_minutes": 45
}'

post '{
    "title": "Rewriting jargon-heavy onboarding docs",
    "body": "Our onboarding doc was written by engineers, for engineers. New hires from non-technical backgrounds were getting stuck. I asked Claude to rewrite each section at a Year 9 reading level while preserving the meaning. Saved me a full afternoon.",
    "ai_tool": "Claude",
    "time_saved_minutes": 90
}'

post '{
    "title": "Generating React component scaffolding",
    "body": "Copilot autocompletes the boilerplate for new components - props interface, default export, basic JSX shell. I focus on the logic instead of typing the same skeleton ten times a week.",
    "ai_tool": "GitHub Copilot",
    "time_saved_minutes": 15
}'

post '{
    "title": "Brainstorming names for a new feature",
    "body": "We needed a name for the new client dashboard. I gave ChatGPT a paragraph of context and asked for 30 candidates, then iterated on the ones that landed. Beats staring at a blank Notion page.",
    "ai_tool": "ChatGPT",
    "time_saved_minutes": 60
}'

post '{
    "title": "Translating customer feedback from German",
    "body": "We get qualitative survey responses in German from our DACH clients. DeepL handles the translation in one paste. Quality is noticeably better than Google Translate for our domain.",
    "ai_tool": "DeepL",
    "time_saved_minutes": 25
}'

post '{
    "title": "Turning bullet notes into slide outlines",
    "body": "Before a leadership review I dump my talking points into Gemini and ask for a slide-by-slide outline. I still write the actual slides, but having the structure laid out gets me past the blank-deck problem.",
    "ai_tool": "Gemini",
    "time_saved_minutes": 50
}'

post '{
    "title": "Self-reviewing pull requests before opening them",
    "body": "Before I push a PR I ask Claude Code to look over the diff and flag anything sloppy - dead code, missing edge cases, inconsistent naming. Catches the obvious stuff so my reviewers can focus on the real questions.",
    "ai_tool": "Claude Code",
    "time_saved_minutes": 20
}'

echo "Created 9 use cases at $BASE_URL"
