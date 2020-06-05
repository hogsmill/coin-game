const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log(`A user connected with socket id ${socket.id}.`);

  // socket.broadcast.emit("user-connected", socket.id);

  socket.on("disconnect", () => {
    // socket.broadcast.emit("user-disconnected", socket.id);
    console.log(`User with socket id ${socket.id} has disconnected.`);
  });

  // socket.on("nudge-client", (data) => {
  //   socket.broadcast.to(data.to).emit("client-nudged", data);
  // });
});

http.listen(3000, () => {
  console.log("Listening on *:3000");
});
