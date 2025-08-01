const app = require('./app');
const { sequelize, connectDB } = require('./config/database');
require('./services/mqttService');
const http = require('http');
const socketService = require('./services/socketService');

const PORT = process.env.PORT || 5000;

// Veritabanı bağlantısını ve sunucuyu başlat
const startServer = async () => {
  try {
    await connectDB();
    
    const server = http.createServer(app);
    socketService.initSocket(server);
    
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Sunucu ${PORT} portunda çalışıyor.`);
      console.log(`🔗 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('🔴 Sunucu başlatma hatası:', error);
    process.exit(1);
  }
};

startServer();
