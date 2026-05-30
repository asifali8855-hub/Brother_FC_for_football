import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import nodemailer from "nodemailer";

// Data store setup
const DB_PATH = path.join(process.cwd(), "local_db.json");
const ADMIN_EMAIL = "asifali8855@gmail.com";

interface User {
  id: string;
  email: string;
  name: string;
  level: number;
  xp: number;
  streak: number;
  currentDay: number;
  completedDays: any[];
  createdAt: string;
  lastLogin?: string;
  loginHistory?: string[];
  activities?: any[];
}

interface DB {
  users: User[];
  progress: any[];
  stats?: {
    lastUpdated: string;
    totalRegistrations: number;
  };
}

function getDb(): DB {
  if (!fs.existsSync(DB_PATH)) {
    const initial: DB = {
      users: [],
      progress: [],
      stats: {
        lastUpdated: new Date().toISOString(),
        totalRegistrations: 0,
      },
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function saveDb(data: DB) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-app-password",
  },
});

// Send notification email
async function sendNotificationEmail(subject: string, htmlContent: string) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER || "your-email@gmail.com",
      to: ADMIN_EMAIL,
      subject,
      html: htmlContent,
    });
    console.log("Email sent successfully to admin");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

// Send welcome email to new user
async function sendWelcomeEmail(user: User) {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00FF41;">Welcome to Brother FC Football Mastery! 🎯</h2>
        <p>Hi ${user.name},</p>
        <p>Your account has been successfully created with email: <strong>${user.email}</strong></p>
        <p>You can now start your football training journey and track your progress.</p>
        <p><a href="https://brother-f-cforfootball.vercel.app" style="background-color: #00FF41; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Training</a></p>
        <p>Happy training!</p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER || "your-email@gmail.com",
      to: user.email,
      subject: "Welcome to Brother FC - Football Mastery",
      html: htmlContent,
    });
    console.log("Welcome email sent to user");
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

// Send admin notification about new user
async function sendAdminNewUserAlert(user: User, totalUsers: number) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif;">
      <h3>🎉 New User Registration Alert</h3>
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Registered:</strong> ${new Date(user.createdAt).toLocaleString()}</p>
      <p><strong>Total Users Now:</strong> ${totalUsers}</p>
      <hr />
      <p>Dashboard: <a href="https://brother-f-cforfootball.vercel.app/admin">View Stats</a></p>
    </div>
  `;

  await sendNotificationEmail(
    `[New Registration] ${user.name} - Total Users: ${totalUsers}`,
    htmlContent
  );
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

  // User Auth - Enhanced with history tracking
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      const db = getDb();

      if (db.users.find((u) => u.email === email)) {
        return res.status(400).json({ error: "User already exists" });
      }

      const newUser: User = {
        id: Math.random().toString(36).substring(7),
        email,
        name,
        level: 1,
        xp: 0,
        streak: 0,
        currentDay: 1,
        completedDays: [],
        createdAt: new Date().toISOString(),
        loginHistory: [new Date().toISOString()],
        activities: [],
      };

      db.users.push(newUser);
      if (!db.stats) {
        db.stats = {
          lastUpdated: new Date().toISOString(),
          totalRegistrations: 0,
        };
      }
      db.stats.totalRegistrations = db.users.length;
      db.stats.lastUpdated = new Date().toISOString();
      saveDb(db);

      // Send emails asynchronously
      sendWelcomeEmail(newUser).catch(console.error);
      sendAdminNewUserAlert(newUser, db.users.length).catch(console.error);

      res.json({
        user: newUser,
        message: "Registration successful! Check your email for confirmation.",
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const db = getDb();
      const user = db.users.find((u) => u.email === email);

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Update login tracking
      const now = new Date().toISOString();
      user.lastLogin = now;
      if (!user.loginHistory) user.loginHistory = [];
      user.loginHistory.push(now);

      // Add login activity
      if (!user.activities) user.activities = [];
      user.activities.push({
        type: "login",
        timestamp: now,
      });

      saveDb(db);
      res.json({ user });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/stats", (req, res) => {
    try {
      const db = getDb();
      const todayStr = new Date().toISOString().split("T")[0];
      const activeToday = db.users.filter(
        (u) => u.lastLogin && u.lastLogin.startsWith(todayStr)
      ).length;

      res.json({
        totalUsers: db.users.length,
        activeToday,
        totalRegistrations: db.stats?.totalRegistrations || db.users.length,
        lastUpdated: db.stats?.lastUpdated,
      });
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  // User history endpoint
  app.get("/api/user/:userId/history", (req, res) => {
    try {
      const { userId } = req.params;
      const db = getDb();
      const user = db.users.find((u) => u.id === userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        userId: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        loginHistory: user.loginHistory || [],
        totalLogins: (user.loginHistory || []).length,
        activities: user.activities || [],
        completedDays: user.completedDays || [],
        currentStreak: user.streak,
        totalXP: user.xp,
        currentLevel: user.level,
      });
    } catch (error) {
      console.error("History error:", error);
      res.status(500).json({ error: "Failed to get user history" });
    }
  });

  // All users summary (for admin)
  app.get("/api/admin/users-summary", (req, res) => {
    try {
      const db = getDb();
      const summary = db.users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        totalLogins: (user.loginHistory || []).length,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
      }));

      res.json({
        totalUsers: db.users.length,
        users: summary,
        stats: db.stats,
      });
    } catch (error) {
      console.error("Admin summary error:", error);
      res.status(500).json({ error: "Failed to get admin summary" });
    }
  });

  // Daily logic: generate / serve the dataset
  app.get("/api/training/daily", (req, res) => {
    try {
      const userId = req.query.userId as string;
      const db = getDb();
      const user = db.users.find((u) => u.id === userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const currentDay = user.currentDay || 1;

      const dribblingVids = [
        "ClEs4dzW2EA",
        "JdXgO4Z4vsc",
        "_uuqsGCiM9I",
        "naEccnjzLxM",
        "WpqzCxXguZ0",
        "Fj3Jsn0Pa7c",
      ];
      const tacticVids = [
        "Gi4ruPMJhp0",
        "DLzB_wAI88M",
        "ulf9H1S31Vw",
        "Borf1ZVgwZk",
        "9X6o8romXzA",
        "D6_ZQCqBly8",
      ];

      const v1 = dribblingVids[(currentDay - 1) % dribblingVids.length];
      const v2 = tacticVids[(currentDay - 1) % tacticVids.length];

      res.json({
        day: currentDay,
        warmup: {
          title: `Dynamic Flow Level ${currentDay}`,
          duration: "10 mins",
        },
        skill: {
          title: `Dribbling Mastery Drill - Day ${currentDay}`,
          duration: "15 mins",
        },
        tactical: {
          title: `Tactical Awareness Phase ${currentDay}`,
          duration: "15 mins",
        },
        match: {
          title: `Shadow Play Exercises ${currentDay}`,
          duration: "20 mins",
        },
        fitness: {
          title: `Sprint Intervals Phase ${currentDay}`,
          duration: "10 mins",
        },
        recovery: {
          title: "Foam Rolling & Stretching",
          duration: "10 mins",
        },
        quote: `Success is no accident. Keep pushing. Next achievement awaits on Day ${currentDay} - Pele`,
        videos: [
          {
            category: "Dribbling",
            title: `Close Control Drills ${currentDay}`,
            url: `https://www.youtube.com/embed/${v1}`,
          },
          {
            category: "Tactical",
            title: `Positional Play ${currentDay}`,
            url: `https://www.youtube.com/embed/${v2}`,
          },
        ],
      });
    } catch (error) {
      console.error("Daily training error:", error);
      res.status(500).json({ error: "Failed to get daily training" });
    }
  });

  app.post("/api/training/complete", (req, res) => {
    try {
      const { userId, day, drills } = req.body;

      if (!userId || !day) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const db = getDb();
      const user = db.users.find((u) => u.id === userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.completedDays) user.completedDays = [];
      const completion = {
        day,
        date: new Date().toISOString(),
        drillsCompleted: drills,
      };
      user.completedDays.push(completion);
      user.currentDay = (user.currentDay || 1) + 1;
      user.xp += 100; // Reward XP

      // Track activity
      if (!user.activities) user.activities = [];
      user.activities.push({
        type: "training_completed",
        day,
        timestamp: new Date().toISOString(),
      });

      saveDb(db);
      res.json({ success: true, user });
    } catch (error) {
      console.error("Training completion error:", error);
      res.status(500).json({ error: "Failed to complete training" });
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

startServer().catch(console.error);
