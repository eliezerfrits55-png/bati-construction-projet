const CalendarEvent = require("../models/CalendarEvent");
const Project = require("../models/Project");

// @desc    Obtenir les événements du calendrier
// @route   GET /api/calendar/events
exports.getEvents = async (req, res, next) => {
  try {
    const { startDate, endDate, type, status } = req.query;

    const filter = { userId: req.user._id };

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (type) filter.type = type;
    if (status) filter.status = status;

    const events = await CalendarEvent.find(filter)
      .populate("project", "title")
      .populate("client", "first_name last_name")
      .sort({ date: 1 });

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer un événement
// @route   POST /api/calendar/events
exports.createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      date,
      time,
      duration,
      location,
      type,
      projectId,
      clientId,
      reminder,
    } = req.body;

    const event = await CalendarEvent.create({
      userId: req.user._id,
      title,
      description: description || "",
      date,
      time: time || null,
      duration: duration || null,
      location: location || "",
      type: type || "autre",
      projectId: projectId || null,
      clientId: clientId || null,
      reminder: reminder || 30,
    });

    res.status(201).json({
      success: true,
      message: "Événement créé avec succès",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un événement
// @route   PUT /api/calendar/events/:id
exports.updateEvent = async (req, res, next) => {
  try {
    const event = await CalendarEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Événement non trouvé",
      });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (
      event.userId.toString() !== req.user._id.toString() &&
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
      "date",
      "time",
      "duration",
      "location",
      "type",
      "status",
      "reminder",
    ];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedEvent = await CalendarEvent.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true },
    );

    res.json({
      success: true,
      message: "Événement mis à jour",
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un événement
// @route   DELETE /api/calendar/events/:id
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await CalendarEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Événement non trouvé",
      });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (
      event.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé",
      });
    }

    await event.deleteOne();

    res.json({
      success: true,
      message: "Événement supprimé avec succès",
    });
  } catch (error) {
    next(error);
  }
};
