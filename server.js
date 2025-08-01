const app = require('./app');
const db = require('./models'); // models/index.js otomatik yüklendi
require('./services/mqttService');
const http = require('http');
const socketService = require('./services/socketService');

const PORT = process.env.PORT || 5000;

db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('🟢 Tüm tablolar başarıyla oluşturuldu/güncellendi.');

    // HTTP server oluştur
    const server = http.createServer(app);

    // Socket.IO server'ını başlat
    socketService.initSocket(server);

    server.listen(PORT, () => {
      console.log(`🚀 Sunucu ${PORT} portunda çalışıyor.`);
    });
  })
  .catch((err) => {
    console.error('🔴 Tablo oluşturma hatası:', err);
  });
