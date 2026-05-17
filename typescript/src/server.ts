import express, { Response } from "express";
import path from "path";
import { randomUUID } from "crypto";
import db from "./db";
import { UseCaseResponse, ToolStats, StatsResponse, ErrorResponse } from "./types";

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/usecases", (req, res: Response<UseCaseResponse[] | ErrorResponse>) => {
    try {
        const rows = db
            .prepare("SELECT * FROM usecases ORDER BY rowid DESC")
            .all() as UseCaseResponse[] | [];
        res.json(rows);
    } catch (error) {
        console.error("Internal Server Error: ", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
});

app.get("/api/usecases/:id", (req, res: Response<UseCaseResponse | ErrorResponse>) => {
    try {
        const row = db
            .prepare("SELECT * FROM usecases WHERE id = ?")
            .get(req.params.id) as UseCaseResponse | undefined;

        if (!row) {
            return res.status(404).json({ error: "Use case not found" });
        }

        res.json(row);
    } catch (error) {
        console.error("Internal Server Error: ", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
});

app.post("/api/usecases", (req, res) => {
    const id = randomUUID();
    const { title, body, ai_tool, time_saved_minutes } = req.body;

    if (!title?.trim() || !body?.trim() || !ai_tool?.trim()) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const minutes_saved = parseInt(time_saved_minutes, 10);
    if (isNaN(minutes_saved) || minutes_saved < 0) {
        return res.status(400).json({ error: "Time saved must be 0 or a positive number." });
    }

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

app.get("/api/stats", (req, res: Response<StatsResponse | ErrorResponse>) => {
    try {
        const totalRow = db
            .prepare("SELECT SUM(time_saved_minutes) AS grandTotalMinutes from usecases")
            .get() as { grandTotalMinutes: number | null } | undefined;

        const grandTotalMinutes = totalRow?.grandTotalMinutes || 0;

        const timeSavedPerTool = db
            .prepare("SELECT ai_tool AS aiTool, COALESCE(SUM(time_saved_minutes), 0) AS totalTimeSaved from usecases GROUP BY ai_tool")
            .all() as ToolStats[];

        res.json({
            overallTotalTimeSaved: grandTotalMinutes,
            timeSavedPerTool: timeSavedPerTool || []
        });
    } catch (error) {
        console.error("Internal Server Error: ", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
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
