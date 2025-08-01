const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false,
});

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
