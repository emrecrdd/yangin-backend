const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // opsiyonel ama genelde Render'da gerekebilir
    }
  },
});
,
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
