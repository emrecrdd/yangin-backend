// controllers/alertController.js
const { Alert, Sensor } = require('../models');

module.exports = {
  // Tüm uyarılar (isteğe bağlı filtre ile)
  async getAllAlerts(req, res) {
    try {
      const { sensorId, status } = req.query;

      const where = {};
      if (sensorId) where.sensorId = sensorId;
      if (status) where.status = status;

      const alerts = await Alert.findAll({
        where,
        include: [{ model: Sensor }],
        order: [['createdAt', 'DESC']],
      });

      res.json(alerts);
    } catch (err) {
      console.error('⚠️ getAllAlerts error:', err.message);
      res.status(500).json({ error: 'Uyarılar alınamadı' });
    }
  },

  // Tek uyarı
  async getAlertById(req, res) {
    try {
      const alert = await Alert.findByPk(req.params.id);
      if (!alert) return res.status(404).json({ error: 'Uyarı bulunamadı' });
      res.json(alert);
    } catch (err) {
      console.error('⚠️ getAlertById error:', err.message);
      res.status(500).json({ error: 'Uyarı getirilemedi' });
    }
  },

  // Uyarı durumu güncelleme (örneğin resolved yapmak)
  async updateAlertStatus(req, res) {
    try {
      const alert = await Alert.findByPk(req.params.id);
      if (!alert) return res.status(404).json({ error: 'Uyarı bulunamadı' });

      const { status } = req.body;
      if (!['active', 'resolved'].includes(status))
        return res.status(400).json({ error: 'Geçersiz durum' });

      alert.status = status;
      await alert.save();

      res.json({ message: 'Uyarı güncellendi', alert });
    } catch (err) {
      console.error('⚠️ updateAlertStatus error:', err.message);
      res.status(500).json({ error: 'Uyarı güncellenemedi' });
    }
  },
};
