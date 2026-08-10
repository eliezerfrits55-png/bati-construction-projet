const Dispute = require("../models/Dispute");
const Project = require("../models/Project");

// @desc    Créer un litige
// @route   POST /api/disputes
exports.createDispute = async (req, res, next) => {
  try {
    const { projectId, title, description, category, priority } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Projet non trouvé",
      });
    }

    // Vérifier que l'utilisateur est impliqué dans le projet
    const isInvolved =
      project.clientId.toString() === req.user._id.toString() ||
      (project.technicianId &&
        project.technicianId.toString() === req.user._id.toString());

    if (!isInvolved && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas impliqué dans ce projet",
      });
    }

    const dispute = await Dispute.create({
      projectId,
      clientId: project.clientId,
      technicianId: project.technicianId,
      title,
      description,
      category: category || "other",
      priority: priority || "medium",
      status: "open",
    });

    res.status(201).json({
      success: true,
      message: "Litige créé avec succès",
      data: dispute,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les litiges d'un projet
// @route   GET /api/disputes/project/:projectId
exports.getProjectDisputes = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const disputes = await Dispute.find({ projectId })
      .populate("client", "first_name last_name avatar")
      .populate("technician", "first_name last_name avatar")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: disputes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ajouter un message à un litige
// @route   POST /api/disputes/:id/messages
exports.addDisputeMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: "Litige non trouvé",
      });
    }

    // Déterminer le type d'expéditeur
    let senderType = "client";
    if (req.user.role === "admin") {
      senderType = "admin";
    } else if (
      dispute.technicianId &&
      dispute.technicianId.toString() === req.user._id.toString()
    ) {
      senderType = "technician";
    }

    dispute.messages.push({
      senderId: req.user._id,
      senderType,
      content,
    });

    await dispute.save();

    res.status(201).json({
      success: true,
      message: "Message ajouté au litige",
      data: dispute,
    });
  } catch (error) {
    next(error);
  }
};
