const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Le prix est requis"],
      min: [0, "Le prix ne peut pas être négatif"],
    },
    delayDays: {
      type: Number,
      required: [true, "Le délai est requis"],
      min: [1, "Le délai doit être d'au moins 1 jour"],
    },
    details: {
      type: String,
      maxlength: [2000, "Les détails ne peuvent pas dépasser 2000 caractères"],
    },
    materials: {
      type: String,
      maxlength: [
        2000,
        "La liste des matériaux ne peut pas dépasser 2000 caractères",
      ],
    },
    conditions: {
      type: String,
      maxlength: [
        2000,
        "Les conditions ne peuvent pas dépasser 2000 caractères",
      ],
    },
    timeline: {
      type: String,
      maxlength: [1000, "Le timeline ne peut pas dépasser 1000 caractères"],
    },
    validUntil: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["envoye", "en_attente", "accepte", "refuse", "expire"],
      default: "envoye",
    },
    acceptedAt: Date,
    refusedAt: Date,
    expiresAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtuals
quoteSchema.virtual("project", {
  ref: "Project",
  localField: "projectId",
  foreignField: "_id",
  justOne: true,
});

quoteSchema.virtual("technician", {
  ref: "User",
  localField: "technicianId",
  foreignField: "_id",
  justOne: true,
});

quoteSchema.virtual("client", {
  ref: "User",
  localField: "clientId",
  foreignField: "_id",
  justOne: true,
});

// Indexes
quoteSchema.index({ projectId: 1 });
quoteSchema.index({ technicianId: 1 });
quoteSchema.index({ status: 1 });
quoteSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Quote", quoteSchema);
