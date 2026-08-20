const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");

// Load environment variables
dotenv.config();

const allowedOrigins = (process.env.CORS_ORIGINS || process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);
const corsOrigin = (origin, callback) => {
  // Autoriser les requêtes sans Origin (health checks, curl) et les origines configurées.
  if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
    return callback(null, true);
  }
  return callback(new Error("Origine non autorisée par CORS"));
};

// Import routes
const authRoutes = require("./src/routes/authRoutes");
const technicianRoutes = require("./src/routes/technicianRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const quoteRoutes = require("./src/routes/quoteRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const calendarRoutes = require("./src/routes/calendarRoutes");
const locationRoutes = require("./src/routes/locationRoutes");

// Import middleware
const { errorHandler } = require("./src/middlewares/erroHandler");

// Initialize express
const app = express();
const httpServer = createServer(app);

// ============ SOCKET.IO ============
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins.length ? allowedOrigins : true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("🔌 Client connecté:", socket.id);

  // Join user room
  socket.on("join-user", (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 Utilisateur ${userId} a rejoint sa room`);
  });

  // Join conversation room
  socket.on("join-conversation", (conversationId) => {
    socket.join(`conversation-${conversationId}`);
    console.log(`💬 Conversation ${conversationId} rejointe`);
  });

  // Send message
  socket.on("send-message", async (data) => {
    try {
      const { conversationId, senderId, receiverId, content } = data;

      // Sauvegarder le message dans la base de données
      const Message = require("./src/models/Message");
      const Conversation = require("./src/models/Conversation");

      const message = await Message.create({
        conversation: conversationId,
        sender: senderId,
        receiver: receiverId,
        content,
      });

      await Conversation.findByIdAndUpdate(conversationId, {
        last_message: content,
        last_message_at: new Date(),
      });

      const populatedMessage = await message.populate(
        "sender",
        "first_name last_name avatar",
      );

      // Envoyer le message à la conversation
      io.to(`conversation-${conversationId}`).emit(
        "new-message",
        populatedMessage,
      );

      // Notifier le destinataire
      io.to(`user-${receiverId}`).emit(
        "new-message-notification",
        populatedMessage,
      );
    } catch (error) {
      console.error("❌ Erreur envoi message:", error);
    }
  });

  // Typing indicator
  socket.on("typing", (data) => {
    const { conversationId, userId, isTyping } = data;
    socket.to(`conversation-${conversationId}`).emit("typing-indicator", {
      userId,
      isTyping,
    });
  });

  // Mark messages as read
  socket.on("mark-read", async (data) => {
    try {
      const { conversationId, userId } = data;
      const Message = require("./src/models/Message");

      await Message.updateMany(
        { conversation: conversationId, receiver: userId, is_read: false },
        { is_read: true, read_at: new Date() },
      );

      io.to(`conversation-${conversationId}`).emit("messages-read", {
        conversationId,
        userId,
      });
    } catch (error) {
      console.error("❌ Erreur marquage lu:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔌 Client déconnecté:", socket.id);
  });
});

// ============ EXPRESS MIDDLEWARE ============
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(compression());
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ============ MONGODB CONNECTION ============
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ============ ROUTES ============
// Service info
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "BATI Construction API opérationnelle",
    health: "/api/health",
  });
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "BATI Construction API opérationnelle",
    health: "/api/health",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/technicians", technicianRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/location", locationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route introuvable",
  });
});

// ============ ERROR HANDLER ============
app.use(errorHandler);

// ============ START SERVER ============
const PORT = Number(process.env.PORT) || 5000;
const HOST = "0.0.0.0";

httpServer.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO ready`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});

module.exports = { app, httpServer, io };
