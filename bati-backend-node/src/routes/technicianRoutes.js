const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const technicianController = require("../controllers/technicianController");

router.get("/", technicianController.getTechnicians);
router.get("/:id", technicianController.getTechnician);
router.post("/", auth, technicianController.createTechnician);
router.put("/:id", auth, technicianController.updateTechnician);
router.get("/:id/stats", auth, technicianController.getTechnicianStats);

module.exports = router;
