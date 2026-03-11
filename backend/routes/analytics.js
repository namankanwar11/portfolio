const express = require("express");
const router = express.Router();
const AnalyticsEvent = require("../models/AnalyticsEvent");
const rateLimit = require("express-rate-limit");

const eventLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many analytics events" },
});

const VALID_TYPES = [
  "page_view",
  "section_view",
  "game_start",
  "game_complete",
  "chatbot_message",
  "contact_submit",
  "project_click",
  "resume_download",
];

router.post("/event", eventLimiter, async (req, res) => {
  try {
    const { type, section, metadata, sessionId, device } = req.body;

    if (!type || !sessionId) {
      return res.status(400).json({ error: "type and sessionId are required" });
    }

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: "Invalid event type" });
    }

    if (typeof sessionId !== "string" || sessionId.length > 64) {
      return res.status(400).json({ error: "Invalid sessionId" });
    }

    const event = await AnalyticsEvent.create({
      type,
      section: typeof section === "string" ? section.slice(0, 50) : null,
      metadata:
        metadata && typeof metadata === "object"
          ? JSON.parse(JSON.stringify(metadata).slice(0, 500))
          : {},
      sessionId: sessionId.slice(0, 64),
      device: ["desktop", "mobile", "tablet"].includes(device)
        ? device
        : "desktop",
    });

    if (req.app.get("io")) {
      req.app.get("io").emit("newEvent", {
        type: event.type,
        section: event.section,
        device: event.device,
        timestamp: event.timestamp,
      });
    }

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("[Analytics] Event error:", error.message);
    res.status(500).json({ error: "Failed to record event" });
  }
});

router.get("/summary", async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last24h = new Date(now - 24 * 60 * 60 * 1000);

    const [
      totalVisitors,
      todayVisitors,
      totalEvents,
      sectionCounts,
      typeCounts,
      deviceCounts,
    ] = await Promise.all([
      AnalyticsEvent.distinct("sessionId").then((ids) => ids.length),
      AnalyticsEvent.distinct("sessionId", {
        timestamp: { $gte: today },
      }).then((ids) => ids.length),
      AnalyticsEvent.countDocuments(),
      AnalyticsEvent.aggregate([
        { $match: { section: { $ne: null } } },
        { $group: { _id: "$section", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      AnalyticsEvent.aggregate([
        { $group: { _id: "$type", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      AnalyticsEvent.aggregate([
        { $group: { _id: "$device", count: { $sum: 1 } } },
      ]),
    ]);

    const gamePlays = typeCounts.find((t) => t._id === "game_start");
    const chatMessages = typeCounts.find((t) => t._id === "chatbot_message");

    res.json({
      totalVisitors,
      todayVisitors,
      totalEvents,
      gamePlays: gamePlays ? gamePlays.count : 0,
      chatMessages: chatMessages ? chatMessages.count : 0,
      sections: sectionCounts.map((s) => ({
        name: s._id,
        count: s.count,
      })),
      eventTypes: typeCounts.map((t) => ({
        type: t._id,
        count: t.count,
      })),
      devices: deviceCounts.map((d) => ({
        device: d._id,
        count: d.count,
      })),
    });
  } catch (error) {
    console.error("[Analytics] Summary error:", error.message);
    res.status(500).json({ error: "Failed to get summary" });
  }
});

router.get("/timeline", async (req, res) => {
  try {
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const hourly = await AnalyticsEvent.aggregate([
      { $match: { timestamp: { $gte: last24h } } },
      {
        $group: {
          _id: {
            hour: { $hour: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
          },
          events: { $sum: 1 },
          visitors: { $addToSet: "$sessionId" },
        },
      },
      {
        $project: {
          hour: "$_id.hour",
          events: 1,
          visitors: { $size: "$visitors" },
        },
      },
      { $sort: { "_id.day": 1, "_id.hour": 1 } },
    ]);

    const timeline = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const h = new Date(now - i * 60 * 60 * 1000);
      const hour = h.getUTCHours();
      const day = h.getUTCDate();
      const match = hourly.find(
        (item) => item._id.hour === hour && item._id.day === day
      );
      timeline.push({
        hour: `${hour.toString().padStart(2, "0")}:00`,
        events: match ? match.events : 0,
        visitors: match ? match.visitors : 0,
      });
    }

    res.json({ timeline });
  } catch (error) {
    console.error("[Analytics] Timeline error:", error.message);
    res.status(500).json({ error: "Failed to get timeline" });
  }
});

router.get("/live", async (req, res) => {
  try {
    const events = await AnalyticsEvent.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .select("type section device timestamp -_id")
      .lean();

    res.json({ events });
  } catch (error) {
    console.error("[Analytics] Live error:", error.message);
    res.status(500).json({ error: "Failed to get live events" });
  }
});

module.exports = router;
