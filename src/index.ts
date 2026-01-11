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

httpServer.listen(3001, () => {
  console.log(`Server running on http://localhost:3001`);
});
