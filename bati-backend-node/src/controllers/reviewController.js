const Review = require("../models/Review");
const Project = require("../models/Project");
const Technician = require("../models/Technician");

// @desc    Créer un avis
// @route   POST /api/reviews
exports.createReview = async (req, res, next) => {
  try {
    const {
      projectId,
      technicianId,
      rating,
      comment,
      qualityRating,
      punctualityRating,
      communicationRating,
      valueRating,
    } = req.body;

    // Vérifier que le projet existe
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Projet non trouvé",
      });
    }

    // Vérifier que l'utilisateur est le client du projet
    if (project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à donner un avis sur ce projet",
      });
    }

    // Vérifier que le projet est terminé
    if (project.status !== "termine") {
      return res.status(400).json({
        success: false,
        message: "Le projet doit être terminé pour donner un avis",
      });
    }

    // Vérifier si un avis existe déjà
    const existingReview = await Review.findOne({ projectId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Un avis a déjà été donné pour ce projet",
      });
    }

    const review = await Review.create({
      projectId,
      clientId: req.user._id,
      technicianId,
      rating,
      comment,
      qualityRating: qualityRating || rating,
      punctualityRating: punctualityRating || rating,
      communicationRating: communicationRating || rating,
      valueRating: valueRating || rating,
    });

    // Mettre à jour la note du technicien
    await updateTechnicianRating(technicianId);

    res.status(201).json({
      success: true,
      message: "Avis publié avec succès",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les avis d'un technicien
// @route   GET /api/reviews/technician/:technicianId
exports.getTechnicianReviews = async (req, res, next) => {
  try {
    const { technicianId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ technicianId })
      .populate("client", "first_name last_name avatar")
      .populate("project", "title")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ technicianId });

    // Calculer les statistiques
    const stats = await getReviewStats(technicianId);

    res.json({
      success: true,
      data: {
        reviews,
        stats,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un avis
// @route   PUT /api/reviews/:id
exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Avis non trouvé",
      });
    }

    // Vérifier que l'utilisateur est le client
    if (review.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé",
      });
    }

    const allowedFields = [
      "rating",
      "comment",
      "qualityRating",
      "punctualityRating",
      "communicationRating",
      "valueRating",
    ];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true },
    );

    // Mettre à jour la note du technicien
    await updateTechnicianRating(review.technicianId);

    res.json({
      success: true,
      message: "Avis mis à jour",
      data: updatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un avis
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Avis non trouvé",
      });
    }

    // Vérifier que l'utilisateur est le client ou admin
    if (
      review.clientId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé",
      });
    }

    const technicianId = review.technicianId;
    await review.deleteOne();

    // Mettre à jour la note du technicien
    await updateTechnicianRating(technicianId);

    res.json({
      success: true,
      message: "Avis supprimé avec succès",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Répondre à un avis (admin ou technicien)
// @route   POST /api/reviews/:id/reply
exports.replyToReview = async (req, res, next) => {
  try {
    const { content } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Avis non trouvé",
      });
    }

    // Vérifier que l'utilisateur est le technicien ou admin
    const isAuthorized =
      req.user.role === "admin" ||
      review.technicianId.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé",
      });
    }

    review.reply = {
      content,
      repliedAt: new Date(),
      repliedBy: req.user._id,
    };
    await review.save();

    res.json({
      success: true,
      message: "Réponse ajoutée",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// Fonctions auxiliaires
async function updateTechnicianRating(technicianId) {
  const reviews = await Review.find({ technicianId });
  const totalReviews = reviews.length;

  if (totalReviews === 0) {
    await Technician.findByIdAndUpdate(technicianId, {
      rating: 0,
      totalReviews: 0,
    });
    return;
  }

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  await Technician.findByIdAndUpdate(technicianId, {
    rating: Math.round(avgRating * 10) / 10,
    totalReviews,
  });
}

async function getReviewStats(technicianId) {
  const reviews = await Review.find({ technicianId });
  const total = reviews.length;

  if (total === 0) {
    return {
      total,
      averageRating: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / total;
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    if (distribution[r.rating] !== undefined) distribution[r.rating]++;
  });

  return {
    total,
    averageRating: Math.round(avgRating * 10) / 10,
    distribution,
  };
}
