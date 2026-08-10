const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const reviewController = require("../controllers/reviewController");

router.post("/", auth, reviewController.createReview);
router.get("/technician/:technicianId", reviewController.getTechnicianReviews);
router.put("/:id", auth, reviewController.updateReview);
router.delete("/:id", auth, reviewController.deleteReview);
router.post("/:id/reply", auth, reviewController.replyToReview);

module.exports = router;
