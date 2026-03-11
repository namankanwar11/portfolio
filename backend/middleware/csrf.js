const { doubleCsrf } = require("csrf-csrf");
const cookieParser = require("cookie-parser");

const csrfSecret = process.env.CSRF_SECRET || "portfolio-csrf-secret-change-in-production";

const {
  generateToken,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: () => csrfSecret,
  cookieName: "__Host-psifi.x-csrf-token",
  cookieOptions: {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  },
  size: 64,
  getTokenFromRequest: (req) => req.headers["x-csrf-token"],
});

function csrfTokenRoute(req, res) {
  const token = generateToken(req, res);
  res.json({ csrfToken: token });
}

module.exports = {
  cookieParser: cookieParser(),
  doubleCsrfProtection,
  csrfTokenRoute,
};
