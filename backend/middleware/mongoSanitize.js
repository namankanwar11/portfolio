function stripDollarKeys(obj) {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(stripDollarKeys);

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("$")) {
      console.warn(`[SECURITY] Stripped dangerous key: ${key}`);
      continue;
    }
    clean[key] = stripDollarKeys(value);
  }
  return clean;
}

function mongoSanitize(req, res, next) {
  if (req.body && typeof req.body === "object") {
    req.body = stripDollarKeys(req.body);
  }
  if (req.query && typeof req.query === "object") {
    req.query = stripDollarKeys(req.query);
  }
  if (req.params && typeof req.params === "object") {
    req.params = stripDollarKeys(req.params);
  }
  next();
}

module.exports = mongoSanitize;
