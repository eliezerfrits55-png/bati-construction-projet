const Project = require("../models/Project");
const Quote = require("../models/Quote");
const User = require("../models/User");
const ProjectTimeline = require("../models/ProjectTimeline");

// @desc    Obtenir les projets
// @route   GET /api/projects
exports.getProjects = async (req, res, next) => {
  try {
    const { status, clientId, technicianId, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (clientId) filter.clientId = clientId;
    if (technicianId) filter.technicianId = technicianId;

    // Si l'utilisateur est client ou technicien, filtrer ses projets
    if (req.user.role === "client") {
      filter.clientId = req.user._id;
    } else if (req.user.role === "technician") {
      filter.technicianId = req.user._id;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const projects = await Project.find(filter)
      .populate("client", "-password")
      .populate("technician", "-password")
      .populate("quotes")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(filter);

    res.json({
      success: true,
      count: projects.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un projet
// @route   GET /api/projects/:id
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("client", "-password")
      .populate("technician", "-password")
      .populate("quotes")
      .populate("timeline");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Projet non trouvé",
      });
    }

    // Vérifier l'accès
    const isAuthorized =
      req.user.role === "admin" ||
      project.clientId._id.toString() === req.user._id.toString() ||
      (project.technicianId &&
        project.technicianId._id.toString() === req.user._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Accès non autorisé",
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer un projet
// @route   POST /api/projects
exports.createProject = async (req, res, next) => {
  try {
    const { title, description, location, address, budget, deadline } =
      req.body;

    const project = await Project.create({
      clientId: req.user._id,
      title,
      description,
      location,
      address: address || "",
      budget: budget || null,
      deadline: deadline || null,
      status: "en_attente_devis",
    });

    // Ajouter une entrée dans la timeline
    await ProjectTimeline.create({
      projectId: project._id,
      title: "Projet créé",
      description: "Demande de devis envoyée",
      status: "completed",
    });

    res.status(201).json({
      success: true,
      message: "Projet créé avec succès",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un projet
// @route   PUT /api/projects/:id
exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Projet non trouvé",
      });
    }

    // Vérifier que l'utilisateur est le client
    if (
      project.clientId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "location",
      "address",
      "budget",
      "deadline",
    ];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true },
    );

    res.json({
      success: true,
      message: "Projet mis à jour",
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour le statut d'un projet
// @route   PATCH /api/projects/:id/status
exports.updateProjectStatus = async (req, res, next) => {
  try {
    const { status, progress } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Projet non trouvé",
      });
    }

    // Vérifier l'autorisation
    const isAuthorized =
      req.user.role === "admin" ||
      project.clientId.toString() === req.user._id.toString() ||
      (project.technicianId &&
        project.technicianId.toString() === req.user._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé",
      });
    }

    const oldStatus = project.status;

    // Mettre à jour
    project.status = status || project.status;
    if (progress !== undefined) project.progress = progress;

    if (status === "termine") {
      project.completedAt = new Date();
      project.progress = 100;
    }

    if (status === "en_cours" && !project.startedAt) {
      project.startedAt = new Date();
    }

    await project.save();

    // Ajouter une entrée dans la timeline
    await ProjectTimeline.create({
      projectId: project._id,
      title: `Statut mis à jour: ${status}`,
      description: `Le statut est passé de "${oldStatus}" à "${status}"`,
      status: status === "termine" ? "completed" : "in_progress",
    });

    res.json({
      success: true,
      message: "Statut mis à jour",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};
