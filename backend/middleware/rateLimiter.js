const rateLimit = require("express-rate-limit");

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.ip === "::1" || req.ip === "127.0.0.1",
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes.",
  },
  handler: (req, res, next, options) => {
    console.warn(`[RATE LIMIT] Global limit exceeded for IP: ${req.ip}`);
    res.status(429).json(options.message);
  },
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
  message: {
    error: "Too many contact submissions. Please try again in 15 minutes.",
  },
  handler: (req, res, next, options) => {
    console.warn(`[RATE LIMIT] Contact limit exceeded for IP: ${req.ip}`);
    res.status(429).json(options.message);
  },
});

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many chat requests. Please slow down.",
  },
  handler: (req, res, next, options) => {
    console.warn(`[RATE LIMIT] Chat limit exceeded for IP: ${req.ip}`);
    res.status(429).json(options.message);
  },
});

module.exports = { globalLimiter, contactLimiter, chatLimiter };
