const BASE = "http://localhost:5000";

async function test(name, fn) {
  try {
    const result = await fn();
    console.log(result ? `  PASS  ${name}` : `  FAIL  ${name}`);
  } catch (e) {
    console.log(`  FAIL  ${name} — ${e.message}`);
  }
}

async function run() {
  console.log("\n  Security Test Suite\n  " + "=".repeat(40) + "\n");

  await test("Valid contact → 201", async () => {
    const res = await fetch(`${BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello, this is a valid test message.",
        recaptchaToken: "dummy-token",
      }),
    });
    return res.status === 201;
  });

  await test("XSS in message → 400", async () => {
    const res = await fetch(`${BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Hacker",
        email: "hacker@example.com",
        message: "Check this out: <script>alert(1)</script>",
        recaptchaToken: "dummy-token",
      }),
    });
    return res.status === 400;
  });

  await test("SQL injection in name → 400", async () => {
    const res = await fetch(`${BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "'; DROP TABLE users; --",
        email: "hacker@example.com",
        message: "Valid message here.",
        recaptchaToken: "dummy-token",
      }),
    });
    return res.status === 400;
  });

  await test("NoSQL injection via $gt → 400", async () => {
    const res = await fetch(`${BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: { $gt: "" },
        email: "test@test.com",
        message: "Testing NoSQL injection.",
        recaptchaToken: "dummy-token",
      }),
    });
    return res.status === 400;
  });

  await test("Message too short → 400", async () => {
    const res = await fetch(`${BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Shorty",
        email: "short@example.com",
        message: "Hi",
        recaptchaToken: "dummy-token",
      }),
    });
    return res.status === 400;
  });

  await test("Invalid email format → 400", async () => {
    const res = await fetch(`${BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Attacker",
        email: "hacker_example.com",
        message: "Valid message",
        recaptchaToken: "dummy-token",
      }),
    });
    return res.status === 400;
  });

  await test("Security headers present on GET /", async () => {
    const res = await fetch(`${BASE}/`);
    const h = res.headers;
    return (
      h.get("x-content-type-options") === "nosniff" &&
      h.get("x-frame-options") === "DENY" &&
      !h.get("x-powered-by")
    );
  });

  await test("CORS blocks unknown origin", async () => {
    const res = await fetch(`${BASE}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://evil-site.com",
      },
      body: JSON.stringify({
        name: "CORS Test",
        email: "cors@test.com",
        message: "Testing CORS from unknown origin.",
      }),
    });
    const acao = res.headers.get("access-control-allow-origin");
    return !acao || acao !== "https://evil-site.com";
  });

  await test("Rate limiting → 429 after excess requests", async () => {
    const results = [];
    for (let i = 0; i < 12; i++) {
      const res = await fetch(`${BASE}/api/contact`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "User-Agent": "Rate-Tester"
        },
        body: JSON.stringify({
          name: "Rate Tester",
          email: "rate@test.com",
          message: `Rate limit test message number ${i + 1}`,
          recaptchaToken: "dummy-token",
        }),
      });
      results.push(res.status);
    }
    return results.includes(429);
  });

  console.log("\n  " + "=".repeat(40) + "\n  Tests complete.\n");
}

run().catch(console.error);
