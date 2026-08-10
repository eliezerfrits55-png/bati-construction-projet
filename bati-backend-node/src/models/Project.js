const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    title: {
      type: String,
      required: [true, "Le titre est requis"],
      trim: true,
      maxlength: [200, "Le titre ne peut pas dépasser 200 caractères"],
    },
    description: {
      type: String,
      required: [true, "La description est requise"],
      maxlength: [2000, "La description ne peut pas dépasser 2000 caractères"],
    },
    location: {
      type: String,
      required: [true, "La localisation est requise"],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    budget: {
      type: Number,
      min: [0, "Le budget ne peut pas être négatif"],
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: [
        "en_attente_devis",
        "devis_envoye",
        "accepte",
        "en_preparation",
        "en_cours",
        "controle",
        "termine",
        "annule",
      ],
      default: "en_attente_devis",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    documents: [
      {
        name: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    images: [String],
    additionalInfo: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    completedAt: Date,
    startedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtuals
projectSchema.virtual("client", {
  ref: "User",
  localField: "clientId",
  foreignField: "_id",
  justOne: true,
});

projectSchema.virtual("technician", {
  ref: "User",
  localField: "technicianId",
  foreignField: "_id",
  justOne: true,
});

projectSchema.virtual("quotes", {
  ref: "Quote",
  localField: "_id",
  foreignField: "projectId",
});

projectSchema.virtual("timeline", {
  ref: "ProjectTimeline",
  localField: "_id",
  foreignField: "projectId",
});

// Indexes
projectSchema.index({ clientId: 1 });
projectSchema.index({ technicianId: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Project", projectSchema);
