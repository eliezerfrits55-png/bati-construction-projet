const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const adminController = require("../controllers/adminController");

// Toutes les routes admin nécessitent le rôle admin
router.use(auth, role("admin"));

router.get("/users", adminController.getUsers);
router.get("/technicians/pending", adminController.getPendingTechnicians);
router.post("/technicians/:id/validate", adminController.validateTechnician);
router.post("/technicians/:id/block", adminController.blockTechnician);
router.get("/stats", adminController.getStats);

module.exports = router;
