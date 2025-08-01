const http = require('http');
const app = require('./app');
const socketService = require('./services/socketService');
const db = require('./models');

const PORT = process.env.PORT || 3000;

db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('🟢 Tüm tablolar başarıyla oluşturuldu/güncellendi.');

    const server = http.createServer(app);

    socketService.initSocket(server);

    server.listen(PORT, () => {
      console.log(`🚀 Sunucu ${PORT} portunda çalışıyor.`);
    });
  })
  .catch((err) => {
    console.error('🔴 Tablo oluşturma hatası:', err);
  });
