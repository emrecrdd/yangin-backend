// socket.js
const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // Geliştirme için, prod'da domain ayarlanmalı
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket bağlandı: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Socket ayrıldı: ${socket.id}`);
    });
  });
}

// Sensör güncellemesini frontend'e gönder
function emitSensorUpdate(sensor) {
  if (io) {
    io.emit("sensor_updated", sensor);
  }
}

module.exports = {
  initSocket,
  emitSensorUpdate,
};
