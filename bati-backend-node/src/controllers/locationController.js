const User = require("../models/User");
const Technician = require("../models/Technician");
const Project = require("../models/Project");

const parseCoordinates = (body) => {
  const latitude = Number(body.latitude);
  const longitude = Number(body.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;
  return { latitude, longitude };
};

exports.updateMyLocation = async (req, res, next) => {
  try {
    const coordinates = parseCoordinates(req.body);
    if (!coordinates) {
      return res.status(400).json({ success: false, message: "Coordonnées GPS invalides" });
    }

    const location = {
      type: "Point",
      coordinates: [coordinates.longitude, coordinates.latitude],
      updatedAt: new Date(),
    };

    if (req.user.role === "technician") {
      await Technician.findOneAndUpdate({ userId: req.user._id }, { location }, { new: true });
    } else {
      await User.findByIdAndUpdate(req.user._id, { location }, { new: true });
    }

    res.json({ success: true, message: "Position mise à jour", data: { latitude: coordinates.latitude, longitude: coordinates.longitude } });
  } catch (error) {
    next(error);
  }
};

exports.getTechnicians = async (req, res, next) => {
  try {
    const filter = { status: "approved" };
    const technicians = await Technician.find(filter).populate("userId", "first_name last_name city phone").limit(100);
    const cityCoordinates = {
      Yaoundé: [11.52, 3.87],
      Douala: [9.77, 4.05],
      Bafoussam: [10.42, 5.48],
      Garoua: [13.55, 9.3],
    };
    res.json({ success: true, data: technicians.map((technician) => ({
      id: technician._id,
      name: `${technician.userId?.first_name || "Technicien"} ${technician.userId?.last_name || ""}`.trim(),
      trade: technician.trade,
      city: technician.userId?.city || "",
      latitude: technician.location?.coordinates?.[1] || cityCoordinates[technician.userId?.city]?.[1],
      longitude: technician.location?.coordinates?.[0] || cityCoordinates[technician.userId?.city]?.[0],
      approximate: !technician.location?.coordinates?.[0] && Boolean(cityCoordinates[technician.userId?.city]),
      rating: technician.rating,
    })) });
  } catch (error) {
    next(error);
  }
};

exports.getClients = async (req, res, next) => {
  try {
    const projects = await Project.find({ technicianId: req.user._id }).select("clientId title");
    const clientIds = [...new Set(projects.map((project) => project.clientId?.toString()).filter(Boolean))];
    const clients = await User.find({ _id: { $in: clientIds }, "location.coordinates.0": { $ne: 0 }, "location.coordinates.1": { $ne: 0 } }).select("first_name last_name city location");
    res.json({ success: true, data: clients.map((client) => ({
      id: client._id,
      name: `${client.first_name} ${client.last_name}`.trim(),
      city: client.city || "",
      latitude: client.location.coordinates[1],
      longitude: client.location.coordinates[0],
    })) });
  } catch (error) {
    next(error);
  }
};
