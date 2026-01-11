import { Server, Socket } from "socket.io";

interface Comment {
  id: string;
  userName: string;
  description: string;
  time: string;
  postId: string;
}

export function commentsSocket(io: Server, socket: Socket) {
  socket.on("join-post", (postId: string) => {
    socket.join(`post:${postId}`);
    console.log(`Socket ${socket.id} joined post:${postId}`);
  });

  socket.on("leave-post", (postId: string) => {
    socket.leave(`post:${postId}`);
    console.log(`Socket ${socket.id} left post:${postId}`);
  });

  socket.on("create-comment", (comment: Comment) => {
    io.to(`post:${comment.postId}`).emit("new-comment", comment);
  });
}
