require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const app = require("./src/app");
const connectDB = require("./src/config/database");

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
app.set("io", io);
// load socket
require("./src/socket/chat.socket")(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});