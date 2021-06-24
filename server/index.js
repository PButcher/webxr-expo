const config = require("./config.json");
const http = require("http");
const path = require("path");
const express = require("express");

process.title = "webxr-expo";

const port = _isValidPort(process.argv[2])
  ? process.argv[2]
  : config?.port
  ? config.port
  : process.env.PORT || 3010;

const app = express();
app.use(express.static(path.resolve(__dirname, "../public")));

const server = http.createServer(app);
const io = require("socket.io")(server, {
  // Fixes "WebSocket is already in CLOSING or CLOSED state" issue in Chrome
  // https://github.com/socketio/socket.io/issues/3259
  pingTimeout: 60000,
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  let curRoom = null;

  socket.on("joinRoom", (data) => {
    const { room } = data;

    if (!rooms[room]) {
      rooms[room] = {
        name: room,
        occupants: {},
      };
    }

    const joinedTime = Date.now();
    rooms[room].occupants[socket.id] = joinedTime;
    curRoom = room;

    console.log(`${socket.id} joined room ${room}`);
    socket.join(room);

    socket.emit("connectSuccess", { joinedTime });
    const occupants = rooms[room].occupants;
    io.in(curRoom).emit("occupantsChanged", { occupants });
  });

  socket.on("send", (data) => {
    io.to(data.to).emit("send", data);
  });

  socket.on("broadcast", (data) => {
    socket.to(curRoom).broadcast.emit("broadcast", data);
  });

  socket.on("disconnect", () => {
    console.log("disconnected: ", socket.id, curRoom);
    if (rooms[curRoom]) {
      console.log("user disconnected", socket.id);

      delete rooms[curRoom].occupants[socket.id];
      const occupants = rooms[curRoom].occupants;
      socket.to(curRoom).broadcast.emit("occupantsChanged", { occupants });

      if (occupants == {}) {
        console.log("everybody left room");
        delete rooms[curRoom];
      }
    }
  });
});

server.listen(port, () => {
  console.log("Listening on http://localhost:" + port);
});

// Valid port checker
function _isValidPort(port) {
  return parseInt(port) >= 1 && parseInt(port) <= 99999;
}
