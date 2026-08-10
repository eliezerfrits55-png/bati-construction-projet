const Technician = require("../models/Technician");
const User = require("../models/User");
const Project = require("../models/Project");
const Review = require("../models/Review");

// @desc    Obtenir tous les techniciens (avec filtres)
// @route   GET /api/technicians
exports.getTechnicians = async (req, res, next) => {
  try {
    const {
      trade,
      city,
      minRating,
      maxPrice,
      available,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    // Construire le filtre
    const filter = { verification_status: "approved" };

    if (trade) {
      filter.trade = { $regex: trade, $options: "i" };
    }

    if (city) {
      const users = await User.find({
        city: { $regex: city, $options: "i" },
      }).select("_id");
      filter.user = { $in: users.map((u) => u._id) };
    }

    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    if (maxPrice) {
      filter.hourly_rate = { $lte: parseFloat(maxPrice) };
    }

    if (available === "true") {
      filter.is_available = true;
    }

    if (search) {
      const users = await User.find({
        $or: [
          { first_name: { $regex: search, $options: "i" } },
          { last_name: { $regex: search, $options: "i" } },
        ],
      }).select("_id");
      filter.user = { $in: users.map((u) => u._id) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const technicians = await Technician.find(filter)
      .populate("user", "-password")
      .populate("reviews")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ rating: -1, createdAt: -1 });

    const total = await Technician.countDocuments(filter);

    // Calculer les statistiques par technicien
    const techniciansWithStats = technicians.map((tech) => {
      const techObj = tech.toObject();
      const reviews = tech.reviews || [];
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

      return {
        ...techObj,
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length,
      };
    });

    res.json({
      success: true,
      count: technicians.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: techniciansWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un technicien par ID
// @route   GET /api/technicians/:id
exports.getTechnician = async (req, res, next) => {
  try {
    const technician = await Technician.findById(req.params.id)
      .populate("user", "-password")
      .populate("reviews")
      .populate("portfolio");

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: "Technicien non trouvé",
      });
    }

    // Calculer les statistiques
    const reviews = technician.reviews || [];
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    // Compter les projets terminés
    const completedProjects = await Project.countDocuments({
      technicianId: technician.user._id,
      status: "termine",
    });

    const technicianData = technician.toObject();
    technicianData.averageRating = Math.round(avgRating * 10) / 10;
    technicianData.totalReviews = reviews.length;
    technicianData.completedProjects = completedProjects;

    res.json({
      success: true,
      data: technicianData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer un profil technicien
// @route   POST /api/technicians
exports.createTechnician = async (req, res, next) => {
  try {
    const { trade, experience_years, bio, hourly_rate, specialties } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Vérifier si l'utilisateur est déjà technicien
    const existingTechnician = await Technician.findOne({ user: req.user._id });
    if (existingTechnician) {
      return res.status(400).json({
        success: false,
        message: "Vous êtes déjà technicien",
      });
    }

    const technician = await Technician.create({
      user: req.user._id,
      trade,
      experience_years: experience_years || 0,
      bio: bio || "",
      hourly_rate: hourly_rate || null,
      specialties: specialties || [],
      verification_status: "pending",
    });

    // Mettre à jour le rôle de l'utilisateur
    await User.findByIdAndUpdate(req.user._id, {
      role: "technician",
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Profil technicien créé, en attente de validation",
      data: technician,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un technicien
// @route   PUT /api/technicians/:id
exports.updateTechnician = async (req, res, next) => {
  try {
    const technician = await Technician.findById(req.params.id);

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: "Technicien non trouvé",
      });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (
      technician.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé",
      });
    }

    const allowedFields = [
      "trade",
      "experience_years",
      "bio",
      "hourly_rate",
      "specialties",
      "is_available",
      "certifications",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedTechnician = await Technician.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true },
    ).populate("user", "-password");

    res.json({
      success: true,
      message: "Profil mis à jour",
      data: updatedTechnician,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Statistiques d'un technicien
// @route   GET /api/technicians/:id/stats
exports.getTechnicianStats = async (req, res, next) => {
  try {
    const technician = await Technician.findById(req.params.id);
    if (!technician) {
      return res.status(404).json({
        success: false,
        message: "Technicien non trouvé",
      });
    }

    const userId = technician.user;

    // Projets
    const totalProjects = await Project.countDocuments({
      technicianId: userId,
    });
    const completedProjects = await Project.countDocuments({
      technicianId: userId,
      status: "termine",
    });
    const inProgressProjects = await Project.countDocuments({
      technicianId: userId,
      status: { $in: ["en_cours", "en_preparation", "accepte"] },
    });

    // Avis
    const reviews = await Review.find({ technicianId: userId });
    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    // Répartition des notes
    const ratingDistribution = {
      1: reviews.filter((r) => r.rating === 1).length,
      2: reviews.filter((r) => r.rating === 2).length,
      3: reviews.filter((r) => r.rating === 3).length,
      4: reviews.filter((r) => r.rating === 4).length,
      5: reviews.filter((r) => r.rating === 5).length,
    };

    res.json({
      success: true,
      data: {
        totalProjects,
        completedProjects,
        inProgressProjects,
        totalReviews,
        averageRating: Math.round(avgRating * 10) / 10,
        ratingDistribution,
        acceptanceRate:
          totalProjects > 0
            ? Math.round((completedProjects / totalProjects) * 100)
            : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
