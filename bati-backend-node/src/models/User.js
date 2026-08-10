const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "Le prénom est requis"],
      trim: true,
      maxlength: [50, "Le prénom ne peut pas dépasser 50 caractères"],
    },
    last_name: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
      maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Veuillez fournir un email valide"],
    },
    phone: {
      type: String,
      required: [true, "Le téléphone est requis"],
      trim: true,
      match: [
        /^(?:\+?237)?[62][0-9]{8}$/,
        "Veuillez fournir un numéro de téléphone valide",
      ],
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
      minlength: [8, "Le mot de passe doit contenir au moins 8 caractères"],
      select: false,
    },
    role: {
      type: String,
      enum: ["client", "technician", "admin"],
      default: "client",
    },
    city: {
      type: String,
      trim: true,
    },
    quartier: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "active",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: Date,
    emailVerified: {
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

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual full name
userSchema.virtual("full_name").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

// Virtual initials
userSchema.virtual("initials").get(function () {
  return `${this.first_name?.charAt(0) || ""}${this.last_name?.charAt(0) || ""}`.toUpperCase();
});

// Virtual technician profile
userSchema.virtual("technician", {
  ref: "Technician",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

module.exports = mongoose.model("User", userSchema);
