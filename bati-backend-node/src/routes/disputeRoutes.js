const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const disputeController = require("../controllers/disputeController");

router.post("/", auth, disputeController.createDispute);
router.get("/project/:projectId", auth, disputeController.getProjectDisputes);
router.post("/:id/messages", auth, disputeController.addDisputeMessage);

module.exports = router;
