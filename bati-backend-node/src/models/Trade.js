const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom du métier est requis"],
      unique: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "🛠️",
    },
    description: String,
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Trade", tradeSchema);
