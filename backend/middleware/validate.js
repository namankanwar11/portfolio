const validator = require("validator");

const INJECTION_PATTERNS = [
  /<script[\s>]/i,
  /<\/script>/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /DROP\s+TABLE/i,
  /SELECT\s+\*/i,
  /INSERT\s+INTO/i,
  /DELETE\s+FROM/i,
  /UNION\s+SELECT/i,
  /ALTER\s+TABLE/i,
  /EXEC\s*\(/i,
  /--\s*$/,
  /;\s*DROP/i,
  /\$where/i,
  /\$gt/i,
  /\$lt/i,
  /\$ne/i,
  /\$regex/i,
  /\$nin/i,
  /\$or/i,
  /\$and/i,
  /\$exists/i,
];

function sanitizeString(str) {
  if (typeof str !== "string") return "";
  let clean = validator.stripLow(str, true);
  clean = validator.escape(clean);
  clean = clean.replace(/<[^>]*>/g, "");
  return clean.trim();
}

function containsInjection(value) {
  if (typeof value !== "string") return false;
  return INJECTION_PATTERNS.some((pattern) => pattern.test(value));
}

function deepCheckInjection(obj) {
  if (typeof obj === "string") return containsInjection(obj);
  if (typeof obj !== "object" || obj === null) return false;
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$")) return true;
    if (deepCheckInjection(obj[key])) return true;
  }
  return false;
}

function validateContact(req, res, next) {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
    return res.status(400).json({ error: "Invalid field types" });
  }

  if (deepCheckInjection(req.body)) {
    console.warn(`[SECURITY] Injection attempt blocked from IP: ${req.ip}`);
    return res.status(400).json({ error: "Potentially malicious input detected" });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  if (trimmedName.length < 2 || trimmedName.length > 100) {
    return res.status(400).json({ error: "Name must be 2-100 characters" });
  }

  if (!/^[a-zA-Z\s.\-']+$/.test(trimmedName)) {
    return res.status(400).json({ error: "Name contains invalid characters" });
  }

  if (!validator.isEmail(trimmedEmail)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (trimmedMessage.length < 5 || trimmedMessage.length > 2000) {
    return res.status(400).json({ error: "Message must be 5-2000 characters" });
  }

  req.body.name = sanitizeString(trimmedName);
  req.body.email = validator.normalizeEmail(trimmedEmail) || trimmedEmail;
  req.body.message = sanitizeString(trimmedMessage);

  next();
}

function validateChatInput(req, res, next) {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt is required" });
  }

  if (prompt.length > 500) {
    return res.status(400).json({ error: "Prompt too long (max 500 characters)" });
  }

  if (deepCheckInjection(req.body)) {
    console.warn(`[SECURITY] Chat injection attempt blocked from IP: ${req.ip}`);
    return res.status(400).json({ error: "Potentially malicious input detected" });
  }

  req.body.prompt = sanitizeString(prompt.trim());
  next();
}

module.exports = {
  sanitizeString,
  containsInjection,
  deepCheckInjection,
  validateContact,
  validateChatInput,
};
