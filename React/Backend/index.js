// backend/index.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a SQLite (se crea archivo si no existe)
const db = new sqlite3.Database("./farmacia.db");

// Crear tabla de ejemplo si no existe
db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)");

// Endpoint GET (obtener usuarios)
app.get("/api/users", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Endpoint POST (agregar usuario)
app.post("/api/users", (req, res) => {
    const { name, email } = req.body;
    db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, name, email });
    });
});

// Iniciar servidor
const PORT = 4000;
app.listen(PORT, () => console.log(`Servidor backend en http://localhost:${PORT}`));
