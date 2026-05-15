import Database from "better-sqlite3";

const db = new Database("usecases.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS usecases (
        id TEXT PRIMARY KEY,
        title TEXT,
        body TEXT,
        ai_tool TEXT,
        time_saved_minutes TEXT
    )
`);

export default db;
