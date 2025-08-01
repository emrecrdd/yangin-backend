// controllers/sensorController.js
const { Sensor, Region } = require("../models");
const { emitSensorUpdate } = require("../services/socketService"); // socket.js yolunu kendi projene göre ayarla

// Tüm sensörleri getir
exports.getAllSensors = async (req, res) => {
  try {
    const sensors = await Sensor.findAll({
      include: [{ model: Region, attributes: ["id", "name"] }],
    });
    res.status(200).json(sensors);
  } catch (err) {
    res.status(500).json({ error: "Sensörler alınamadı", details: err.message });
  }
};

// Tek sensör getir
exports.getSensorById = async (req, res) => {
  try {
    const sensor = await Sensor.findByPk(req.params.id, {
      include: [{ model: Region, attributes: ["id", "name"] }],
    });
    if (!sensor) return res.status(404).json({ error: "Sensör bulunamadı" });
    res.status(200).json(sensor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Yeni sensör oluştur
exports.createSensor = async (req, res) => {
  try {
    const { latitude, longitude, regionId, temperature, smoke, humidity, status } = req.body;
    const sensor = await Sensor.create({
      latitude,
      longitude,
      regionId,
      temperature,
      smoke,
      humidity,
      status,
    });

    // Sensör oluşturulduktan sonra frontend'i bilgilendir
    emitSensorUpdate(sensor);

    res.status(201).json(sensor);
  } catch (err) {
    res.status(400).json({ error: "Sensör oluşturulamadı", details: err.message });
  }
};

// Sensörü güncelle
exports.updateSensor = async (req, res) => {
  try {
    const sensor = await Sensor.findByPk(req.params.id);
    if (!sensor) return res.status(404).json({ error: "Sensör bulunamadı" });

    await sensor.update(req.body);

    // Sensör güncellendikten sonra frontend'i bilgilendir
    emitSensorUpdate(sensor);

    res.status(200).json(sensor);
  } catch (err) {
    res.status(400).json({ error: "Güncelleme başarısız", details: err.message });
  }
};

// Sensör sil
exports.deleteSensor = async (req, res) => {
  try {
    const sensorId = req.params.id;

    const sensor = await Sensor.findByPk(sensorId);

    if (!sensor) {
      return res.status(404).json({ error: "Sensör bulunamadı" });
    }

    await sensor.destroy();

    // Sensör silindikten sonra frontend'i bilgilendir
    emitSensorUpdate({ id: sensorId, deleted: true });

    return res.status(200).json({ message: "✅ Sensör başarıyla silindi." });
  } catch (err) {
    console.error("❌ Silme sırasında hata:", err);

    return res.status(500).json({
      error: "Sunucu hatası",
      details: err.message,
    });
  }
};
