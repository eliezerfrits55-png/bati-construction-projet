const Quote = require("../models/Quote");
const Project = require("../models/Project");

// @desc    Créer un devis
// @route   POST /api/quotes
exports.createQuote = async (req, res, next) => {
  try {
    const {
      projectId,
      price,
      delayDays,
      details,
      materials,
      conditions,
      timeline,
      validUntil,
    } = req.body;

    // Vérifier que le projet existe
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Projet non trouvé",
      });
    }

    // Vérifier que le technicien est bien assigné
    if (
      project.technicianId &&
      project.technicianId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas assigné à ce projet",
      });
    }

    // Vérifier si un devis existe déjà
    const existingQuote = await Quote.findOne({
      projectId,
      technicianId: req.user._id,
      status: { $in: ["envoye", "en_attente"] },
    });

    if (existingQuote) {
      return res.status(400).json({
        success: false,
        message: "Un devis a déjà été envoyé pour ce projet",
      });
    }

    const quote = await Quote.create({
      projectId,
      technicianId: req.user._id,
      clientId: project.clientId,
      price,
      delayDays,
      details: details || "",
      materials: materials || "",
      conditions: conditions || "",
      timeline: timeline || "",
      validUntil: validUntil || null,
      status: "envoye",
    });

    // Mettre à jour le statut du projet
    await Project.findByIdAndUpdate(projectId, { status: "devis_envoye" });

    res.status(201).json({
      success: true,
      message: "Devis envoyé avec succès",
      data: quote,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les devis d'un projet
// @route   GET /api/projects/:projectId/quotes
exports.getProjectQuotes = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const quotes = await Quote.find({ projectId })
      .populate("technician", "-password")
      .populate("client", "-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: quotes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accepter un devis
// @route   POST /api/quotes/:id/accept
exports.acceptQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Devis non trouvé",
      });
    }

    // Vérifier que l'utilisateur est le client
    if (quote.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé",
      });
    }

    if (quote.status !== "envoye") {
      return res.status(400).json({
        success: false,
        message: "Ce devis ne peut pas être accepté",
      });
    }

    quote.status = "accepte";
    quote.acceptedAt = new Date();
    await quote.save();

    // Mettre à jour le projet
    await Project.findByIdAndUpdate(quote.projectId, {
      technicianId: quote.technicianId,
      status: "accepte",
    });

    res.json({
      success: true,
      message: "Devis accepté avec succès",
      data: quote,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refuser un devis
// @route   POST /api/quotes/:id/reject
exports.rejectQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Devis non trouvé",
      });
    }

    // Vérifier que l'utilisateur est le client
    if (quote.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé",
      });
    }

    if (quote.status !== "envoye") {
      return res.status(400).json({
        success: false,
        message: "Ce devis ne peut pas être refusé",
      });
    }

    quote.status = "refuse";
    quote.refusedAt = new Date();
    await quote.save();

    res.json({
      success: true,
      message: "Devis refusé",
      data: quote,
    });
  } catch (error) {
    next(error);
  }
};
