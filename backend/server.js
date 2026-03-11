const express = require("express");
const http = require("http");
const cors = require("cors");
const hpp = require("hpp");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
require("dotenv").config();

const securityHeaders = require("./middleware/securityHeaders");
const { requestLogger } = require("./middleware/logger");
const { globalLimiter, contactLimiter } = require("./middleware/rateLimiter");
const mongoSanitize = require("./middleware/mongoSanitize");
const { cookieParser } = require("./middleware/csrf");
const { validateContact } = require("./middleware/validate");
const analyticsRoutes = require("./routes/analytics");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);
app.set("trust proxy", 1);

app.use(securityHeaders());
app.use(requestLogger);
app.use(globalLimiter);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked request from origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "x-csrf-token"],
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));
app.use(hpp());
app.use(mongoSanitize);
app.use(cookieParser);

if (isProduction) {
  app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect(301, `https:
    }
    next();
  });
}

const contacts = [];

app.use("/api/analytics", analyticsRoutes);

app.post(
  "/api/contact",
  contactLimiter,
  validateContact,
  async (req, res) => {
    try {
      const { name, email, message, recaptchaToken } = req.body;

      
      if (!recaptchaToken) {
        return res.status(400).json({ error: "reCAPTCHA token missing" });
      }

      const secretKey = process.env.RECAPTCHA_SECRET_KEY || "dummy-secret-key";
      if (secretKey !== "dummy-secret-key") {
        const verifyUrl = `https:
        const recaptchaRes = await fetch(verifyUrl, { method: "POST" });
        const recaptchaData = await recaptchaRes.json();

        if (!recaptchaData.success || recaptchaData.score < 0.5) {
          console.warn(`[SECURITY] reCAPTCHA failed for IP: ${req.ip}`);
          return res.status(403).json({ error: "Bot activity detected" });
        }
      }

      const newContact = { name, email, message, date: new Date() };
      contacts.push(newContact);
      console.log("New message received:", newContact);
      res.status(201).json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
      console.error("Contact error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  }
);

app.get("/", (req, res) => {
  res.send("Portfolio Backend is running");
});

app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN" || err.message === "invalid csrf token") {
    console.warn(`[CSRF] Invalid token from IP: ${req.ip}`);
    return res.status(403).json({ error: "Invalid or missing CSRF token" });
  }

  console.error("[ERROR]", isProduction ? err.message : err.stack);
  res.status(err.status || 500).json({
    error: isProduction ? "Internal server error" : err.message,
  });
});

io.on("connection", (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio")
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT} (${isProduction ? "production" : "development"})`
      );
    });
  })
  .catch((err) => {
    console.warn("MongoDB not available, starting without database:", err.message);
    server.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT} WITHOUT MongoDB (${isProduction ? "production" : "development"})`
      );
    });
  });
