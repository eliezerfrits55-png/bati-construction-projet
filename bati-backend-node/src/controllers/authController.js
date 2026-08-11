const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const Technician = require("../models/Technician");

// Générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// @desc    Inscription
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      password,
      role = "client",
      city,
      quartier,
      trade,
      experience_years,
      bio,
    } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Cet email est déjà utilisé",
      });
    }

    // Créer l'utilisateur
    const user = await User.create({
      first_name,
      last_name,
      email,
      phone,
      password,
      role: role === "technician" ? "technician" : "client",
      city,
      quartier,
      status: role === "technician" ? "pending" : "active",
    });

    // Si technicien → créer le profil Technician
    if (role === "technician") {
      await Technician.create({
        userId: user._id,
        trade,
        experienceYears: experience_years || 0,
        description: bio || "",
        status: "pending",
      });
    }

    const token = generateToken(user._id);

    // Ne pas renvoyer le password
    user.password = undefined;

    res.status(201).json({
      success: true,
      message:
        role === "technician"
          ? "Compte créé ! Votre profil sera validé par un administrateur."
          : "Compte créé avec succès",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Connexion
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    if (user.status === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Votre compte a été suspendu",
      });
    }

    const token = generateToken(user._id);
    user.password = undefined;

    res.json({
      success: true,
      message: "Connexion réussie",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Utilisateur connecté
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Si technicien, inclure le profil
    let technicianProfile = null;
    if (user.role === "technician") {
      technicianProfile = await Technician.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      user,
      technicianProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mot de passe oublié
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Toujours renvoyer un succès (sécurité)
    if (!user) {
      return res.json({
        success: true,
        message: "Si un compte existe avec cet email, un lien a été envoyé.",
      });
    }

    // Générer un token de reset
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 min
    await user.save({ validateBeforeSave: false });

    // TODO: Envoyer l'email avec le lien
    // const resetUrl = `\( {process.env.CLIENT_URL}/reset-password/ \){resetToken}`;
    // await sendEmail(...)

    res.json({
      success: true,
      message: "Si un compte existe avec cet email, un lien a été envoyé.",
      // En dev uniquement :
      ...(process.env.NODE_ENV === "development" && { resetToken }),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Réinitialiser le mot de passe
// @route   POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token invalide ou expiré",
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Mot de passe réinitialisé",
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour le profil
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      "first_name",
      "last_name",
      "phone",
      "city",
      "quartier",
      "avatar",
    ];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Profil mis à jour",
      user,
    });
  } catch (error) {
    next(error);
  }
};
