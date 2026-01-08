import { Server, Socket } from "socket.io";

interface Post {
  id: string;
  title: string;
  description: string;
  time: string;
}

const posts: Post[] = [];

export function postsSocket(io: Server, socket: Socket) {
  // Send all posts when user connects
  socket.emit("posts:init", posts);

  // Create a new post
  socket.on("create-post", (data: { title: string; description: string }) => {
    if (!data.title || !data.description) return;

    const post: Post = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      time: new Date().toLocaleDateString(),
    };

    posts.unshift(post);

    // Broadcast to all clients
    io.emit("new-post", post);
  });
}
