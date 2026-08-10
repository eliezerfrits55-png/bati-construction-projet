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
      .sort({ last_message_at: -1 });

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
        project: projectId || undefined,
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
    const messages = await Message.find({
      conversation: req.params.id,
    })
      .populate("sender", "first_name last_name avatar")
      .sort({ createdAt: 1 });

    // Marquer comme lus
    await Message.updateMany(
      {
        conversation: req.params.id,
        receiver: req.user._id,
        is_read: false,
      },
      { is_read: true, read_at: new Date() },
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

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      receiver: receiverId,
      content,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      last_message: content,
      last_message_at: new Date(),
    });

    const populated = await message.populate(
      "sender",
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
