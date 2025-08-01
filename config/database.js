const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Production'da CA sertifikası ekleyerek true yapın
    }
  },
  logging: console.log, // Hata ayıklama için
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Bağlantı testi fonksiyonunu güncelleyin
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("🟢 PostgreSQL bağlantısı başarılı.");
    await sequelize.sync({ alter: true });
    console.log("🟢 Tüm modeller veritabanına senkronize edildi.");
  } catch (error) {
    console.error("🔴 Veritabanı bağlantı hatası:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
