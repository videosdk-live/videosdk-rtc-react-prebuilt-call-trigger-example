const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketio(server);
const port = 5000;

const {
  addUser,
  deleteUser,
  getUsers,
  updateAvailability,
} = require("./users");

io.on("connect", (socket) => {
  socket.on("login", ({ user }, callback) => {
    const { error } = addUser(socket.id, user);
    if (error) return callback(error);
    callback();
  });

  socket.on("call-sales", ({ name }, callback) => {
    const salesPersonExist = getUsers();
    if (typeof salesPersonExist === "object") {
      const isAvailable = salesPersonExist.isAvailable;
      if (isAvailable) {
        io.to(socket.id).emit("connectionStatus", { text: "Ringing..." });

        socket.to(salesPersonExist.userId).emit("notify", {
          name,
          from: socket.id,
        });
      } else {
        callback("Sales person is busy");
      }
    } else {
      callback("Sales person is not available");
    }
    callback();
  });

  socket.on("accept-call", ({ to, meetingId }) => {
    socket.to(to).emit("connectionStatus", { text: "Connected!!", meetingId });
    updateAvailability(false);
  });

  socket.on("reject-call", ({ to }) => {
    socket.to(to).emit("connectionStatus", { text: "Rejected :(" });
  });

  socket.on("disconnect", () => {
    deleteUser(socket.id);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/get-token", (req, res) => {
  const API_KEY = process.env.ZUJONOW_API_KEY;
  const SECRET_KEY = process.env.ZUJONOW_SECRET_KEY;
  const options = { expiresIn: "30m", algorithm: "HS256" };
  const payload = {
    apikey: API_KEY,
    permissions: ["allow_join", "allow_mod"], // also accepts "ask_join"
  };
  const token = jwt.sign(payload, SECRET_KEY, options);

  res.json({ token });
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
