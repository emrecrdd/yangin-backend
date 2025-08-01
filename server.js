const app = require('./app');
const db = require('./models');
const { connectDB } = require('./config/database');
require('./services/mqttService');
const http = require('http');
const socketService = require('./services/socketService');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();  // DB bağlantısını test et
    await db.sequelize.sync({ alter: true });
    console.log('🟢 Tüm tablolar başarıyla oluşturuldu/güncellendi.');

    const server = http.createServer(app);
    socketService.initSocket(server);

    server.listen(PORT, () => {
      console.log(`🚀 Sunucu ${PORT} portunda çalışıyor.`);
    });
  } catch (err) {
    console.error('🔴 Başlatma hatası:', err);
    process.exit(1);
  }
})();
