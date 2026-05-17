import { vi, describe, it, expect, beforeEach } from "vitest";
import request from "supertest";

vi.mock("../src/db", () => {
    const Database = require("better-sqlite3");
    const mockDb = new Database(":memory:");

    mockDb.exec(`
        CREATE TABLE IF NOT EXISTS usecases (
            id TEXT PRIMARY KEY,
            title TEXT,
            body TEXT,
            ai_tool TEXT,
            time_saved_minutes INTEGER
            )
            `);

    return {
        default: mockDb
    };
})

import app from "../src/server";
import db from "../src/db";
import { formatTime } from "../public/utils.js";
import { ToolStats } from "../src/types.js";

describe("get stats endpoint integration tests", () => {
    beforeEach(() => {
        db.prepare("DELETE FROM usecases").run();
    });

    it("aggregates data correctly for a single case", async () => {
        const insert = db.prepare("INSERT INTO usecases (id, title, body, ai_tool, time_saved_minutes) VALUES (?, ?, ?, ?, ?)");

        insert.run("1", "Email", "Drafting...", "ChatGPT", 30);

        const res = await request(app).get("/api/stats");
        expect(res.status).toBe(200);
        expect(res.body.overallTotalTimeSaved).toBe(30);

        const chatGPT = res.body.timeSavedPerTool.find((tool: ToolStats) => tool.aiTool === "ChatGPT");

        expect(res.body.timeSavedPerTool.length).toBe(1);
        expect(chatGPT.totalTimeSaved).toBe(30);
    })

    it("aggregates data correctly for multiple cases", async () => {
        const insert = db.prepare("INSERT INTO usecases (id, title, body, ai_tool, time_saved_minutes) VALUES (?, ?, ?, ?, ?)");

        insert.run("1", "Email", "Drafting...", "ChatGPT", 30);
        insert.run("2", "Summarizing", "Reading...", "ChatGPT", 20);
        insert.run("3", "Coding", "Debugging...", "Claude", 15);

        const res = await request(app).get("/api/stats");
        expect(res.status).toBe(200);
        expect(res.body.overallTotalTimeSaved).toBe(65);

        const chatGPT = res.body.timeSavedPerTool.find((tool: ToolStats) => tool.aiTool === "ChatGPT");
        const claude = res.body.timeSavedPerTool.find((tool: ToolStats) => tool.aiTool === "Claude");

        expect(res.body.timeSavedPerTool.length).toBe(2);
        expect(chatGPT.totalTimeSaved).toBe(50);
        expect(claude.totalTimeSaved).toBe(15);
    })

    it("handles unexpected nulls or missing data gracefully", async () => {
        const insert = db.prepare("INSERT INTO usecases (id, title, body, ai_tool, time_saved_minutes) VALUES (?, ?, ?, ?, ?)");

        insert.run("99", "Broken", "Drafting", "Claude", null);
        insert.run("100", "Working", "Drafting", "ChatGPT", 20);

        const res = await request(app).get("/api/stats");

        const claude = res.body.timeSavedPerTool.find((tool: ToolStats) => tool.aiTool === "Claude");

        expect(res.status).toBe(200);
        expect(res.body.overallTotalTimeSaved).toBe(20);
        expect(claude.totalTimeSaved).toBe(0);
    })

    it("returns zeros when the database is completely empty", async () => {
        const res = await request(app).get("/api/stats");

        expect(res.status).toBe(200);
        expect(res.body.overallTotalTimeSaved).toBe(0);
        expect(res.body.timeSavedPerTool.length).toBe(0);
    })
})

describe("formatTime helper", () => {
    it("formats minutes to include hours", () => {
        expect(formatTime(150)).toBe("2h 30min");
    })

    it("formats minutes without hours correctly", () => {
        expect(formatTime(30)).toBe("30min");
    })

    it("handles exactly zero minutes", () => {
        expect(formatTime(0)).toBe("0min");
    })

    it("handles whole hours without showing 0 min", () => {
        expect(formatTime(60)).toBe("1h");
    })
})