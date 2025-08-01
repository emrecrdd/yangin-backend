// /config/database.js
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,     // Veritabanı adı
  process.env.DB_USER,     // Kullanıcı
  process.env.DB_PASS, // Şifre
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false, // Konsolda SQL loglarını kapatmak için
  }
);

// Bağlantıyı test et
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("🟢 PostgreSQL bağlantısı başarılı.");
  } catch (error) {
    console.error("🔴 Veritabanı bağlantı hatası:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
