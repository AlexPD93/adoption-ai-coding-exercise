import express, { Response } from "express";
import path from "path";
import { randomUUID } from "crypto";
import db from "./db";
import { ToolStats, StatsResponse } from "./types";

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/usecases", (req, res) => {
    const rows = db
        .prepare("SELECT * FROM usecases ORDER BY rowid DESC")
        .all();
    res.json(rows);
});

app.get("/api/usecases/:id", (req, res) => {
    const row = db
        .prepare("SELECT * FROM usecases WHERE id = ?")
        .get(req.params.id);
    res.json(row);
});

app.post("/api/usecases", (req, res) => {
    const id = randomUUID();
    const { title, body, ai_tool, time_saved_minutes } = req.body;
    const minutes_saved = parseInt(time_saved_minutes, 10) || 0;
    db.prepare(
        "INSERT INTO usecases (id, title, body, ai_tool, time_saved_minutes) VALUES (?, ?, ?, ?, ?)"
    ).run(id, title, body, ai_tool, minutes_saved);
    res.json({ id });
});

app.delete("/api/usecases", (req, res) => {
    const result = db.prepare("DELETE FROM usecases").run();
    res.json({ deleted: result.changes });
});

app.get("/usecase/*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.get("/api/stats", (req, res: Response<StatsResponse>) => {
    const { grandTotalMinutes } = db
        .prepare("SELECT SUM(time_saved_minutes) AS grandTotalMinutes from usecases")
        .get() as {grandTotalMinutes: number} || {grandTotalMinutes: 0};

    const timeSavedPerTool = db
        .prepare("SELECT ai_tool AS aiTool, SUM(time_saved_minutes) AS totalTimeSaved from usecases GROUP BY ai_tool")
        .all() as ToolStats[];

    res.json({ 
        overallTotalTimeSaved: grandTotalMinutes || 0, 
        timeSavedPerTool: timeSavedPerTool || []
    });
})

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html")); 
});

if (process.env.NODE_ENV !== "test") {
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Listening on http://localhost:${PORT}`);
    });
}

export default app;
