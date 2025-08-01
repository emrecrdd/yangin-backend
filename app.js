const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sensorRoutes = require("./routes/sensorRoutes");
const alertRoutes = require('./routes/alertRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Ana route
app.get("/", (req, res) => {
  res.send("Merhaba, server çalışıyor.");
});

app.use("/api/sensors", sensorRoutes);
app.use('/api/alerts', alertRoutes);

module.exports = app;
