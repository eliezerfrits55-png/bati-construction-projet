const mongoose = require("mongoose");

const calendarEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Le titre est requis"],
      trim: true,
      maxlength: [200, "Le titre ne peut pas dépasser 200 caractères"],
    },
    description: {
      type: String,
      maxlength: [1000, "La description ne peut pas dépasser 1000 caractères"],
    },
    date: {
      type: Date,
      required: [true, "La date est requise"],
    },
    time: {
      type: String,
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Format d'heure invalide (HH:MM)",
      ],
    },
    duration: {
      type: Number,
      min: [15, "La durée minimale est de 15 minutes"],
      max: [480, "La durée maximale est de 8 heures"],
    },
    location: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["chantier", "reunion", "devis", "livraison", "visite", "autre"],
      default: "autre",
    },
    status: {
      type: String,
      enum: ["planifie", "en_cours", "termine", "annule", "reporte"],
      default: "planifie",
    },
    reminder: {
      type: Number,
      default: 30, // minutes before event
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtuals
calendarEventSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

calendarEventSchema.virtual("project", {
  ref: "Project",
  localField: "projectId",
  foreignField: "_id",
  justOne: true,
});

calendarEventSchema.virtual("client", {
  ref: "User",
  localField: "clientId",
  foreignField: "_id",
  justOne: true,
});

// Indexes
calendarEventSchema.index({ userId: 1, date: 1 });
calendarEventSchema.index({ projectId: 1 });
calendarEventSchema.index({ status: 1 });
calendarEventSchema.index({ type: 1 });

module.exports = mongoose.model("CalendarEvent", calendarEventSchema);
