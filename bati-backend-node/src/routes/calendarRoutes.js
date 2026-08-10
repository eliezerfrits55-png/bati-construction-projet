const express = require("express");
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/calendarController");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

router.use(auth, role("technician"));

router.get("/", getEvents);
router.post("/", createEvent);
router.patch("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
