import express from "express";
import path from "path";
import { randomUUID } from "crypto";
import db from "./db";

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
    db.prepare(
        "INSERT INTO usecases (id, title, body, ai_tool, time_saved_minutes) VALUES (?, ?, ?, ?, ?)"
    ).run(id, title, body, ai_tool, time_saved_minutes);
    res.json({ id });
});

app.delete("/api/usecases", (req, res) => {
    const result = db.prepare("DELETE FROM usecases").run();
    res.json({ deleted: result.changes });
});

app.get("/usecase/*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.get("/api/stats", (req, res) => {

})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
