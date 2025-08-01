const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
dotenv.config();

const { connectDB, sequelize } = require("./config/database");

const MQTT = require("mqtt");
const mqttClient = MQTT.connect(process.env.MQTT_BROKER_URL);

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;

// Basit bir route
app.get("/", (req, res) => {
  res.send("Merhaba, server çalışıyor.");
});

mqttClient.on("connect", () => {
  console.log("MQTT broker bağlandı.");
  mqttClient.subscribe(process.env.MQTT_TOPIC, (err) => {
    if (err) {
      console.error("MQTT abone olma hatası:", err);
    } else {
      console.log(`MQTT topic'ine abone olundu: ${process.env.MQTT_TOPIC}`);
    }
  });
});

mqttClient.on("message", (topic, message) => {
  console.log(`MQTT mesajı geldi: ${message.toString()}`);
  // Socket ile client'lara gönder
  io.emit("mqtt_message", message.toString());
});

io.on("connection", (socket) => {
  console.log("Yeni socket bağlandı:", socket.id);
});

(async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log("🟢 Tüm tablolar oluşturuldu/güncellendi.");

    server.listen(PORT, () => {
      console.log(`🚀 Sunucu ${PORT} portunda çalışıyor.`);
    });
  } catch (error) {
    console.error("🔴 Başlatma hatası:", error);
    process.exit(1);
  }
})();
