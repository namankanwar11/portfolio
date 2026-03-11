const mongoose = require("mongoose");

const analyticsEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "page_view",
        "section_view",
        "game_start",
        "game_complete",
        "chatbot_message",
        "contact_submit",
        "project_click",
        "resume_download",
      ],
      index: true,
    },
    section: {
      type: String,
      default: null,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    device: {
      type: String,
      enum: ["desktop", "mobile", "tablet"],
      default: "desktop",
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
    vpirutalId: false,
  }
);

analyticsEventSchema.index({ timestamp: -1 });
analyticsEventSchema.index({ type: 1, timestamp: -1 });

module.exports = mongoose.model("AnalyticsEvent", analyticsEventSchema);
