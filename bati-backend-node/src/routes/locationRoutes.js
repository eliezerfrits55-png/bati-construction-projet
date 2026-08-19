const express = require("express");
const auth = require("../middlewares/auth");
const locationController = require("../controllers/locationController");

const router = express.Router();
router.use(auth);
router.put("/me", locationController.updateMyLocation);
router.get("/technicians", locationController.getTechnicians);
router.get("/clients", locationController.getClients);

module.exports = router;
