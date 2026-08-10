const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const projectController = require("../controllers/projectController");

router.get("/", auth, projectController.getProjects);
router.post("/", auth, projectController.createProject);
router.get("/:id", auth, projectController.getProject);
router.put("/:id", auth, projectController.updateProject);
router.patch("/:id/status", auth, projectController.updateProjectStatus);

module.exports = router;
