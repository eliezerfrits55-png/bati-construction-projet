const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const messageController = require("../controllers/messageController");

router.get("/conversations", auth, messageController.getConversations);
router.post("/conversations", auth, messageController.createConversation);
router.get("/conversations/:id", auth, messageController.getMessages);
router.post("/", auth, messageController.sendMessage);

module.exports = router;
