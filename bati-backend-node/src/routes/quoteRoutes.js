const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const quoteController = require("../controllers/quoteController");

router.post("/", auth, quoteController.createQuote);
router.get("/project/:projectId", auth, quoteController.getProjectQuotes);
router.post("/:id/accept", auth, quoteController.acceptQuote);
router.post("/:id/reject", auth, quoteController.rejectQuote);

module.exports = router;
