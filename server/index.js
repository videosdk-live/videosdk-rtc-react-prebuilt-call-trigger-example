const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
const jwt = require("jsonwebtoken");
const { default: fetch } = require("node-fetch");

const server = http.createServer(app);
const io = socketio(server);
const port = 5000;

const {
  addUser,
  deleteUser,
  getUsers,
  updateAvailability,
} = require("./users");

const generateToken = () => {
  const API_KEY = process.env.VIDEOSDK_API_KEY;
  const SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;

  const options = { expiresIn: "365d", algorithm: "HS256" };

  const payload = {
    apikey: API_KEY,
    permissions: ["allow_join", "allow_mod"], // also accepts "ask_join"
  };

  const token = jwt.sign(payload, SECRET_KEY, options);

  return token;
};

const generateMeetingId = async (token) => {
  const url = `${process.env.VIDEOSDK_API_ENDPOINT}/api/meetings`;

  const options = {
    method: "POST",
    headers: { Authorization: token },
  };

  const res = await new Promise((resolve, reject) => {
    fetch(url, options)
      .then((response) => response.json())
      .then((result) => resolve(result)) // result will contain meetingId
      .catch((error) => reject(error));
  });

  return res;
};

io.on("connect", (socket) => {
  socket.on("login", ({ user }, callback) => {
    const { error } = addUser(socket.id, user);
    if (error) return callback(error);
    callback();
  });

  socket.on("call-sales", async ({ name }, callback) => {
    const salesPersonExist = getUsers();
    if (typeof salesPersonExist === "object") {
      const isAvailable = salesPersonExist.isAvailable;
      if (isAvailable) {
        io.to(socket.id).emit("connectionStatus", { text: "Ringing..." });

        const token = generateToken();
        const meetingId = generateMeetingId(token);

        socket.to(salesPersonExist.userId).emit("notify", {
          name,
          from: socket.id,
          token,
          meetingId,
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
    const token = generateToken();

    socket
      .to(to)
      .emit("connectionStatus", { text: "Connected!!", meetingId, token });
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
  const token = generateToken();

  res.json({ token });
});

app.post("/create-meeting/", async (req, res) => {
  const token = req.body.token;

  const resMeeintgId = await generateMeetingId(token);

  res.json(resMeeintgId);
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
