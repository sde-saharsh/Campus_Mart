import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import connectDB from './src/config/db.js';
import userRouter from './src/routes/user.route.js';
import itemRouter from './src/routes/item.route.js';
import favoriteRouter from './src/routes/favorite.route.js';
import orderRouter from './src/routes/order.route.js';
import notificationRouter from './src/routes/notification.route.js';
import uploadRouter from './src/routes/upload.route.js';
import chatRouter from './src/routes/chat.route.js';
import reviewRouter from './src/routes/review.route.js';
import adminRouter from './src/routes/admin.route.js';
import { createServer } from "http";
import { Server } from "socket.io";
import { saveChatMessage } from './src/controllers/chat.controller.js';

dotenv.config();
const app = express();
const httpServer = createServer(app);
const getClientUrls = () => {
    const urls = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : [];
    return urls.map(url => url.trim());
};

const allowedOrigins = getClientUrls();

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

connectDB();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io Logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_room", (orderId) => {
    socket.join(orderId);
  });

  // Join user-specific room for notifications
  socket.on("join_user_room", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined notification room`);
  });

  socket.on("send_message", async ({ orderId, senderId, content }) => {
    try {
      const savedMsg = await saveChatMessage(orderId, senderId, content);
      io.to(orderId).emit("receive_message", savedMsg);
      
      // Emit notification to the OTHER party
      const order = savedMsg.order;
      
      // Ensure we are comparing strings
      const buyerId = (order.buyer._id || order.buyer).toString();
      const sellerId = (order.seller._id || order.seller).toString();
      const msgSenderId = senderId.toString();

      console.log(`[DEBUG] Msg from ${msgSenderId}. Buyer: ${buyerId}, Seller: ${sellerId}`);

      const receiverId = buyerId === msgSenderId ? sellerId : buyerId;
      console.log(`[DEBUG] Calculated Receiver: ${receiverId}`);

      // Double check to prevent self-notification
      if (receiverId !== msgSenderId) {
          console.log(`[DEBUG] Emitting notification to ${receiverId}`);
          io.to(receiverId).emit("new_message_notification", {
            orderId,
            senderId: msgSenderId,
            senderName: savedMsg.sender.name,
            content: savedMsg.content
          });
      } else {
          console.log(`[DEBUG] Self-notification blocked. Receiver === Sender.`);
      }

    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});


// routes
// app.use('/uploads', express.static('uploads')); // Removed for Cloudinary

// routes
app.use('/api/user', userRouter);
app.use('/api/item',itemRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/favorite',favoriteRouter);
app.use('/api/order',orderRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/chat", chatRouter);
app.use("/api/review", reviewRouter);
app.use("/api/admin", adminRouter);


app.get('/', (req, res) => {
    res.send("Server is running...");
});


const PORT = process.env.PORT || 8001;

httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
