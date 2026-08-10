const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "La note est requise"],
      min: [1, "La note minimale est 1"],
      max: [5, "La note maximale est 5"],
    },
    comment: {
      type: String,
      required: [true, "Le commentaire est requis"],
      minlength: [10, "Le commentaire doit contenir au moins 10 caractères"],
      maxlength: [1000, "Le commentaire ne peut pas dépasser 1000 caractères"],
    },
    qualityRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4,
    },
    punctualityRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4,
    },
    communicationRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4,
    },
    valueRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    reply: {
      content: String,
      repliedAt: Date,
      repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtuals
reviewSchema.virtual("project", {
  ref: "Project",
  localField: "projectId",
  foreignField: "_id",
  justOne: true,
});

reviewSchema.virtual("client", {
  ref: "User",
  localField: "clientId",
  foreignField: "_id",
  justOne: true,
});

reviewSchema.virtual("technician", {
  ref: "User",
  localField: "technicianId",
  foreignField: "_id",
  justOne: true,
});

// Indexes
reviewSchema.index({ projectId: 1 });
reviewSchema.index({ technicianId: 1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);
