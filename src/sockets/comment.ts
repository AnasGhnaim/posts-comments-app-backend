import { Server, Socket } from "socket.io";

interface Comment {
  commentId: string;
  userName: string;
  time: string;
  description: string;
  postId: string;
}

const comments: Comment[] = [];

export function commentsSocket(io: Server, socket: Socket) {
  socket.on("join-post", (postId: string) => {
    socket.join(`post:${postId}`);
    console.log(`Socket ${socket.id} joined post:${postId}`);

    // Send all existing comments for this post
    const postComments = comments.filter((c) => c.postId === postId);
    socket.emit("comments:init", postComments);
  });

  socket.on("leave-post", (postId: string) => {
    socket.leave(`post:${postId}`);
    console.log(`Socket ${socket.id} left post:${postId}`);
  });

  socket.on("create-comment", (comment: Comment) => {
    comments.push(comment);
    io.to(`post:${comment.postId}`).emit("new-comment", comment);
  });
}
