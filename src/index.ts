import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { postsSocket } from "./sockets/post";
import { commentsSocket } from "./sockets/comment";

const app = express();
app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("socket Id:", socket.id);

  //I think this will make it simple to read the code
  postsSocket(io, socket);
  commentsSocket(io, socket);

  socket.on("disconnect", () => {
    console.log("socket disconnected:", socket.id);
  });
});

app.post("/emit/post", (req, res) => {
  const { post } = req.body;
  if (!post) return res.status(400).json({ success: false });

  // Broadcast to all clients
  io.emit("new-post", post);
  res.json({ success: true });
});

app.post("/emit/comment", (req, res) => {
  const { comment } = req.body;
  if (!comment) return res.status(400).json({ success: false });

  // Broadcast to all clients in the post room
  io.to(`post:${comment.postId}`).emit("new-comment", comment);
  res.json({ success: true });
});

httpServer.listen(3001, () => {
  console.log(`Server running on http://localhost:3001`);
});
