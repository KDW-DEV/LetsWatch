const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = socketIo(server);

app.use("/dist", express.static(path.join(__dirname, "dist")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (data) => {
    //handle when socket creates a room, or goes to link to a room
    socket.join(data.room);
    socket.room = data.room;
    console.log("current room:", socket.room);

    io.in(socket.room).emit("userJoinedRoom", {
      message: "A new user has joined the room.",
      totalUsers: io.sockets.adapter.rooms[socket.room].length,
    });
  });
  socket.on("disconnect", () => {
    io.in(socket.room).emit("userDisconnect");
  });
});

app.get("/:id", (req, res, next) => {
  res.redirect("/#room=" + req.params.id);
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
