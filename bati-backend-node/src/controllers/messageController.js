const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// @desc    Liste des conversations de l'utilisateur
// @route   GET /api/messages/conversations
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "first_name last_name avatar role")
      .sort({ lastMessageAt: -1 });

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer ou récupérer une conversation
// @route   POST /api/messages/conversations
exports.createConversation = async (req, res, next) => {
  try {
    const { participantId, projectId } = req.body;

    // Chercher une conversation existante
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, participantId] },
    }).populate("participants", "first_name last_name avatar");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, participantId],
        projectId: projectId || undefined,
      });
      conversation = await conversation.populate(
        "participants",
        "first_name last_name avatar",
      );
    }

    res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Messages d'une conversation
// @route   GET /api/messages/conversations/:id
exports.getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      participants: req.user._id,
    });
    if (!conversation) {
      return res.status(403).json({ success: false, message: "Accès à cette conversation refusé" });
    }

    const messages = await Message.find({
      conversationId: req.params.id,
    })
      .populate("senderId", "first_name last_name avatar")
      .sort({ createdAt: 1 });

    // Marquer comme lus
    await Message.updateMany(
      {
        conversationId: req.params.id,
        receiverId: req.user._id,
        isRead: false,
      },
      { isRead: true, readAt: new Date() },
    );

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Envoyer un message
// @route   POST /api/messages
exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId, receiverId, content } = req.body;

    if (!content?.trim() || !receiverId) {
      return res.status(400).json({ success: false, message: "Le destinataire et le message sont requis" });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: { $all: [req.user._id, receiverId] },
    });
    if (!conversation) {
      return res.status(403).json({ success: false, message: "Conversation invalide" });
    }

    const message = await Message.create({
      conversationId,
      senderId: req.user._id,
      receiverId,
      content: content.trim(),
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content.trim(),
      lastMessageAt: new Date(),
      lastMessageSenderId: req.user._id,
    });

    const populated = await message.populate(
      "senderId",
      "first_name last_name avatar",
    );

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};
