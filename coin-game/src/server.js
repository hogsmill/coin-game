const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log(`A user connected with socket id ${socket.id}.`);

  socket.on("disconnect", () => {
    console.log(`User with socket id ${socket.id} has disconnected.`);
  });

  socket.on("clickGo", (data) => {
    console.log("clickGo emit triggered!");
    io.emit("goClicked", data);
  });
});

http.listen(3000, () => {
  console.log("Listening on *:3000");
});
