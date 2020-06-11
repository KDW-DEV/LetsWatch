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

    console.log("current room:", socket.room, "current socket: ", socket.id);

    //socket.to(socket.room).emit("ASK_FOR_VIDEO_INFORMATION");
  });

  socket.on("PLAY", () => {
    socket.to(socket.room).emit("PLAY");
  });

  socket.on("PAUSE", (currentTime) => {
    socket.to(socket.room).emit("PAUSE", currentTime);
  });

  socket.on("SYNC_TIME", (currentTime) => {
    socket.to(socket.room).emit("SYNC_TIME", currentTime);
  });

  socket.on("NEW_VIDEO", (videoURL) => {
    io.to(socket.room).emit("NEW_VIDEO", videoURL);
  });

  socket.on("ASK_FOR_VIDEO_INFORMATION", () => {
    console.log("onAsk socket asking: ", socket.id);
    socket.to(socket.room).emit("ASK_FOR_VIDEO_INFORMATION");
  });

  socket.on("SYNC_VIDEO_INFORMATION", (data) => {
    console.log("onSyncVideo socket: ", socket.id);
    socket.to(socket.room).emit("SYNC_VIDEO_INFORMATION", data);
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
