const mongoose = require("mongoose");

const technicianSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trade: {
      type: String,
      required: [true, "Le métier est requis"],
      trim: true,
    },
    experienceYears: {
      type: Number,
      default: 0,
      min: [0, "L'expérience ne peut pas être négative"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [1000, "La description ne peut pas dépasser 1000 caractères"],
    },
    hourlyRate: {
      type: Number,
      default: null,
      min: [0, "Le taux horaire ne peut pas être négatif"],
    },
    specialties: {
      type: [String],
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
    documents: [
      {
        name: String,
        url: String,
        type: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    totalProjects: {
      type: Number,
      default: 0,
    },
    verifiedAt: Date,
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for user
technicianSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

// Virtual for projects
technicianSchema.virtual("projects", {
  ref: "Project",
  localField: "userId",
  foreignField: "technicianId",
});

// Virtual for portfolio
technicianSchema.virtual("portfolio", {
  ref: "TechnicianPortfolio",
  localField: "_id",
  foreignField: "technicianId",
});

// Index for geolocation queries
technicianSchema.index({ location: "2dsphere" });
technicianSchema.index({ trade: 1 });
technicianSchema.index({ status: 1 });

module.exports = mongoose.model("Technician", technicianSchema);
