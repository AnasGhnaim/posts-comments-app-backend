import { Server, Socket } from "socket.io";

interface Post {
  id: string;
  title: string;
  description: string;
  time: string;
}

const posts: Post[] = [];

export function postsSocket(io: Server, socket: Socket) {
  socket.emit("posts:init", posts);

  socket.on("create-post", (post: Post) => {
    if (!post?.title || !post?.description) return;

    const newPost = {
      ...post,
      id: crypto.randomUUID(), // server owns ID
    };

    posts.unshift(newPost);

    io.emit("new-post", newPost);
  });
}
