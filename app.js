const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sensorRoutes = require("./routes/sensorRoutes");
const alertRoutes = require('./routes/alertRoutes');

dotenv.config();

const app = express();

app.use(cors());               // <-- Burada önce CORS middleware
app.use(express.json());       // <-- Sonra JSON parsing
app.use("/api/sensors", sensorRoutes);
app.use('/api/alerts', alertRoutes);

module.exports = app;
