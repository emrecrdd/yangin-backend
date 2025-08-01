const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,  // Neon sertifikası self-signed olabilir
    },
    // channel_binding Neon için gerekli olabilir, ama çoğu zaman bu ayar yoktur. Eğer sorun olursa kaldırabilirsin.
    // channel_binding: 'require'  
  },
  logging: false,
  // pool config önemli, Neon ile connection pooling yaparken düzgün ayarla
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

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
