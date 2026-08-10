const mongoose = require("mongoose");

const technicianPortfolioSchema = new mongoose.Schema(
  {
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Technician",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Le titre du projet est requis"],
      trim: true,
      maxlength: [200, "Le titre ne peut pas dépasser 200 caractères"],
    },
    description: {
      type: String,
      maxlength: [1000, "La description ne peut pas dépasser 1000 caractères"],
    },
    images: [
      {
        type: String,
        required: [true, "Au moins une image est requise"],
      },
    ],
    category: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      min: [1900, "L'année doit être supérieure à 1900"],
      max: [new Date().getFullYear(), "L'année ne peut pas être dans le futur"],
    },
    link: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtuals
technicianPortfolioSchema.virtual("technician", {
  ref: "Technician",
  localField: "technicianId",
  foreignField: "_id",
  justOne: true,
});

// Indexes
technicianPortfolioSchema.index({ technicianId: 1 });
technicianPortfolioSchema.index({ category: 1 });
technicianPortfolioSchema.index({ isFeatured: 1 });
technicianPortfolioSchema.index({ views: -1 });

module.exports = mongoose.model(
  "TechnicianPortfolio",
  technicianPortfolioSchema,
);
