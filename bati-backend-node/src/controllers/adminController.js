const User = require("../models/User");
const Technician = require("../models/Technician");
const Project = require("../models/Project");
const Quote = require("../models/Quote");
const Review = require("../models/Review");
const Dispute = require("../models/Dispute");

// @desc    Obtenir tous les utilisateurs
// @route   GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les techniciens en attente
// @route   GET /api/admin/technicians/pending
exports.getPendingTechnicians = async (req, res, next) => {
  try {
    const technicians = await Technician.find({
      verification_status: "pending",
    }).populate("user", "-password");

    res.json({
      success: true,
      count: technicians.length,
      data: technicians,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Valider un technicien
// @route   POST /api/admin/technicians/:id/validate
exports.validateTechnician = async (req, res, next) => {
  try {
    const technician = await Technician.findById(req.params.id);
    if (!technician) {
      return res.status(404).json({
        success: false,
        message: "Technicien non trouvé",
      });
    }

    technician.verification_status = "approved";
    technician.verifiedAt = new Date();
    await technician.save();

    // Mettre à jour l'utilisateur
    await User.findByIdAndUpdate(technician.user, { status: "active" });

    res.json({
      success: true,
      message: "Technicien validé avec succès",
      data: technician,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bloquer un technicien
// @route   POST /api/admin/technicians/:id/block
exports.blockTechnician = async (req, res, next) => {
  try {
    const technician = await Technician.findById(req.params.id);
    if (!technician) {
      return res.status(404).json({
        success: false,
        message: "Technicien non trouvé",
      });
    }

    technician.verification_status = "blocked";
    await technician.save();

    await User.findByIdAndUpdate(technician.user, { status: "suspended" });

    res.json({
      success: true,
      message: "Technicien bloqué",
      data: technician,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Statistiques générales
// @route   GET /api/admin/stats
exports.getStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalTechnicians,
      pendingTechnicians,
      totalProjects,
      completedProjects,
      totalQuotes,
      acceptedQuotes,
      totalReviews,
      totalDisputes,
      openDisputes,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "active" }),
      Technician.countDocuments(),
      Technician.countDocuments({ verification_status: "pending" }),
      Project.countDocuments(),
      Project.countDocuments({ status: "termine" }),
      Quote.countDocuments(),
      Quote.countDocuments({ status: "accepte" }),
      Review.countDocuments(),
      Dispute.countDocuments(),
      Dispute.countDocuments({ status: "open" }),
    ]);

    // Revenus totaux (projets terminés)
    const completedProjectsData = await Project.find({ status: "termine" });
    const totalRevenue = completedProjectsData.reduce(
      (sum, p) => sum + (p.budget || 0),
      0,
    );

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalTechnicians,
        pendingTechnicians,
        totalProjects,
        completedProjects,
        totalQuotes,
        acceptedQuotes,
        totalReviews,
        totalDisputes,
        openDisputes,
        totalRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};
