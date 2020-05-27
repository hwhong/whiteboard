const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} is connected`);

  // once the user's drawing is recorded
  // emit to other uses
  socket.on("emit-strokes", (strokes) => {
    socket.broadcast.emit("receive-strokes", strokes);
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id}  disconnected`);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
