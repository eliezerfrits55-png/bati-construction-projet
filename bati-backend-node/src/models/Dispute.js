const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "rejected"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    category: {
      type: String,
      enum: ["quality", "payment", "delay", "communication", "other"],
      default: "other",
    },
    resolution: {
      type: String,
      maxlength: [2000, "La résolution ne peut pas dépasser 2000 caractères"],
    },
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    messages: [
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        senderType: {
          type: String,
          enum: ["client", "technician", "admin"],
          required: true,
        },
        content: {
          type: String,
          required: true,
          maxlength: [2000, "Le message ne peut pas dépasser 2000 caractères"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
      },
    ],
    attachments: [
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtuals
disputeSchema.virtual("project", {
  ref: "Project",
  localField: "projectId",
  foreignField: "_id",
  justOne: true,
});

disputeSchema.virtual("client", {
  ref: "User",
  localField: "clientId",
  foreignField: "_id",
  justOne: true,
});

disputeSchema.virtual("technician", {
  ref: "User",
  localField: "technicianId",
  foreignField: "_id",
  justOne: true,
});

// Indexes
disputeSchema.index({ projectId: 1 });
disputeSchema.index({ status: 1 });
disputeSchema.index({ priority: 1 });
disputeSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Dispute", disputeSchema);
