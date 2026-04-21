import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("zoo.db");

// Initialize Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT,
    password TEXT,
    role TEXT,
    credits INTEGER DEFAULT 100,
    inventory TEXT DEFAULT '[]',
    unlockedThemes TEXT DEFAULT '["Zoo", "Home"]',
    completedLevels INTEGER DEFAULT 0,
    progressMetrics TEXT DEFAULT '{}',
    unlockedMusics TEXT DEFAULT '[]',
    status TEXT DEFAULT 'active',
    lastActivity DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    userId INTEGER,
    username TEXT
  );
`);

// Migration to add unlockedMusics if it doesn't exist
try {
  db.prepare("SELECT unlockedMusics FROM users LIMIT 1").get();
} catch (e) {
  console.log("Migrating database: adding unlockedMusics column to users table...");
  db.exec("ALTER TABLE users ADD COLUMN unlockedMusics TEXT DEFAULT '[]'");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API Routes
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password);
    
    if (user) {
      db.prepare("UPDATE users SET lastActivity = CURRENT_TIMESTAMP WHERE id = ?").run(user.id);
      res.json({
        ...user,
        inventory: JSON.parse(user.inventory),
        unlockedThemes: JSON.parse(user.unlockedThemes),
        progressMetrics: JSON.parse(user.progressMetrics),
        unlockedMusics: JSON.parse(user.unlockedMusics || '[]')
      });
    } else {
      res.status(401).json({ error: "Credenciais inválidas" });
    }
  });

  app.post("/api/register", (req, res) => {
    const { username, email, password, role = 'PLAYER' } = req.body;
    try {
      const info = db.prepare(
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)"
      ).run(username, email, password, role);
      
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);
      res.json({
        ...user,
        inventory: JSON.parse(user.inventory),
        unlockedThemes: JSON.parse(user.unlockedThemes),
        progressMetrics: JSON.parse(user.progressMetrics),
        unlockedMusics: JSON.parse(user.unlockedMusics || '[]')
      });
    } catch (err: any) {
      res.status(400).json({ error: "Utilizador já existe" });
    }
  });

  app.post("/api/user/sync", (req, res) => {
    const { username, credits, inventory, unlockedThemes, completedLevels, progressMetrics, unlockedMusics } = req.body;
    db.prepare(`
      UPDATE users 
      SET credits = ?, inventory = ?, unlockedThemes = ?, completedLevels = ?, progressMetrics = ?, unlockedMusics = ?, lastActivity = CURRENT_TIMESTAMP
      WHERE username = ?
    `).run(
      credits, 
      JSON.stringify(inventory), 
      JSON.stringify(unlockedThemes), 
      completedLevels, 
      JSON.stringify(progressMetrics),
      JSON.stringify(unlockedMusics || []),
      username
    );
    res.json({ success: true });
  });

  app.get("/api/admin/stats", (req, res) => {
    const stats = {
      totalUsers: db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'PLAYER'").get().count,
      activeToday: db.prepare("SELECT COUNT(*) as count FROM users WHERE lastActivity > date('now','-1 day')").get().count,
      totalCredits: db.prepare("SELECT SUM(credits) as sum FROM users").get().sum || 0,
      inventorySize: db.prepare("SELECT SUM(json_array_length(inventory)) as sum FROM users").get().sum || 0,
      users: db.prepare("SELECT id, username, credits, status, lastActivity, json_array_length(unlockedThemes) as unlockedThemes FROM users WHERE role = 'PLAYER'").all(),
      recentActivity: db.prepare("SELECT * FROM achievements ORDER BY timestamp DESC LIMIT 5").all(),
      difficultyStats: [
        { name: 'Fácil', count: 45, color: '#4ade80' },
        { name: 'Médio', count: 32, color: '#fbbf24' },
        { name: 'Difícil', count: 18, color: '#f87171' }
      ]
    };
    res.json(stats);
  });

  // Global Settings API
  app.get("/api/settings", (req, res) => {
    const rows = db.prepare("SELECT * FROM settings").all();
    const config: any = {};
    rows.forEach((row: any) => {
      config[row.key] = JSON.parse(row.value);
    });
    res.json(config);
  });

  app.post("/api/settings", (req, res) => {
    const config = req.body;
    const stmt = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    for (const key in config) {
      stmt.run(key, JSON.stringify(config[key]));
    }
    res.json({ success: true });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Admin bootstrap if not exists
const adminCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'ADMIN'").get().count;
if (adminCount === 0) {
  db.prepare("INSERT INTO users (username, password, role, credits) VALUES (?, ?, ?, ?)").run('admin', 'zoo123', 'ADMIN', 9999);
}

startServer();
