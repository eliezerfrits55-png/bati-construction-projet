const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    // Join user room
    socket.on('join-user', (userId) => {
      socket.join(`user-${userId}`);
    });

    // Join conversation room
    socket.on('join-conversation', (conversationId) => {
      socket.join(`conversation-${conversationId}`);
    });

    // Send message
    socket.on('send-message', async (data) => {
      try {
        const { conversationId, senderId, receiverId, message } = data;
        
        const newMessage = await Message.create({
          conversationId,
          senderId,
          receiverId,
          message,
          isRead: false
        });

        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessageAt: new Date(),
          lastMessage: message
        });

        io.to(`conversation-${conversationId}`).emit('new-message', newMessage);
        io.to(`user-${receiverId}`).emit('new-message-notification', newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });
};