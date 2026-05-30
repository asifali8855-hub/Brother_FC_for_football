import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import fs from "fs";
// Data store setup (using a simple local JSON file to abide by constraints)
const DB_PATH = path.join(process.cwd(), "local_db.json");

interface DB {
  users: any[];
  progress: any[];
}

function getDb(): DB {
  if (!fs.existsSync(DB_PATH)) {
    const initial: DB = { users: [], progress: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function saveDb(data: DB) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  // --- API Routes ---
  
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // User Auth - Simple mock logic
  app.post("/api/auth/register", (req, res) => {
    const { email, password, name } = req.body;
    const db = getDb();
    
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ error: "User already exists" });
    }
    
    const newUser = {
      id: Math.random().toString(36).substring(7),
      email,
      name,
      level: 1,
      xp: 0,
      streak: 0,
      currentDay: 1,
      completedDays: [],
      createdAt: new Date().toISOString()
    };
    
    db.users.push(newUser);
    saveDb(db);
    
    res.json({ user: newUser });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body; // Mock: ignore password check
    const db = getDb();
    const user = db.users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Update lastLogin for active user tracking
    user.lastLogin = new Date().toISOString();
    saveDb(db);
    res.json({ user });
  });

  app.get("/api/stats", (req, res) => {
    const db = getDb();
    const todayStr = new Date().toISOString().split('T')[0];
    const activeToday = db.users.filter(u => u.lastLogin && u.lastLogin.startsWith(todayStr)).length;
    res.json({ totalUsers: db.users.length, activeToday });
  });
  
  // Daily logic: generate / serve the dataset
  app.get("/api/training/daily", (req, res) => {
    const userId = req.query.userId;
    const db = getDb();
    const user = db.users.find(u => u.id === userId);
    const currentDay = user?.currentDay || 1;
    
    const dribblingVids = ['ClEs4dzW2EA', 'JdXgO4Z4vsc', '_uuqsGCiM9I', 'naEccnjzLxM', 'WpqzCxXguZ0', 'Fj3Jsn0Pa7c'];
    const tacticVids = ['Gi4ruPMJhp0', 'DLzB_wAI88M', 'ulf9H1S31Vw', 'Borf1ZVgwZk', '9X6o8romXzA', 'D6_ZQCqBly8'];
    
    const v1 = dribblingVids[(currentDay - 1) % dribblingVids.length];
    const v2 = tacticVids[(currentDay - 1) % tacticVids.length];

    res.json({
      day: currentDay,
      warmup: { title: `Dynamic Flow Level ${currentDay}`, duration: "10 mins" },
      skill: { title: `Dribbling Mastery Drill - Day ${currentDay}`, duration: "15 mins" },
      tactical: { title: `Tactical Awareness Phase ${currentDay}`, duration: "15 mins" },
      match: { title: `Shadow Play Exercises ${currentDay}`, duration: "20 mins" },
      fitness: { title: `Sprint Intervals Phase ${currentDay}`, duration: "10 mins" },
      recovery: { title: "Foam Rolling & Stretching", duration: "10 mins" },
      quote: `Success is no accident. Keep pushing. Next achievement awaits on Day ${currentDay} - Pele`,
      videos: [
        { category: "Dribbling", title: `Close Control Drills ${currentDay}`, url: `https://www.youtube.com/embed/${v1}` },
        { category: "Tactical", title: `Positional Play ${currentDay}`, url: `https://www.youtube.com/embed/${v2}` }
      ]
    });
  });

  app.post("/api/training/complete", (req, res) => {
    const { userId, day, drills } = req.body;
    const db = getDb();
    const user = db.users.find(u => u.id === userId);
    
    if (user) {
      if (!user.completedDays) user.completedDays = [];
      user.completedDays.push({
        day,
        date: new Date().toISOString(),
        drillsCompleted: drills
      });
      user.currentDay = (user.currentDay || 1) + 1;
      user.xp += 100; // Reward XP
      
      saveDb(db);
      res.json({ success: true, user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  // --- End API Routes ---

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
