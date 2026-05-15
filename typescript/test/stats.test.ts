import { vi } from "vitest";
import Database from "better-sqlite3";

vi.mock("../src/db", () => {
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