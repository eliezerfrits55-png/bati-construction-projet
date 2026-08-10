const mongoose = require("mongoose");

const projectTimelineSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Le titre de l'étape est requis"],
      trim: true,
      maxlength: [200, "Le titre ne peut pas dépasser 200 caractères"],
    },
    description: {
      type: String,
      maxlength: [1000, "La description ne peut pas dépasser 1000 caractères"],
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
    images: [String],
    documents: [
      {
        name: String,
        url: String,
      },
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// Virtuals
projectTimelineSchema.virtual("project", {
  ref: "Project",
  localField: "projectId",
  foreignField: "_id",
  justOne: true,
});

projectTimelineSchema.virtual("assignedUser", {
  ref: "User",
  localField: "assignedTo",
  foreignField: "_id",
  justOne: true,
});

// Indexes
projectTimelineSchema.index({ projectId: 1, date: 1 });
projectTimelineSchema.index({ status: 1 });

module.exports = mongoose.model("ProjectTimeline", projectTimelineSchema);
