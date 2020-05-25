const socket = io("http://localhost:3000");

socket.on("connection", (socket) => {
  console.log("in script");
});
