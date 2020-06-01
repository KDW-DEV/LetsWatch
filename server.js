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
  console.log("a user connected");
  socket.on("message", (msg) => {
    io.emit("message", msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/:id", (req, res, next) => {
  res.redirect("/#room=" + req.params.id);
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
