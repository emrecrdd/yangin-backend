// /models/index.js
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Sequelize örneği
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

// Veritabanı bağlantı kontrolü
(async () => {
  try {
    await sequelize.authenticate();
    console.log('🟢 Sequelize: Veritabanına başarıyla bağlanıldı.');
  } catch (err) {
    console.error('🔴 Sequelize bağlantı hatası:', err);
  }
})();

// Tüm modelleri otomatik yükle
const db = {};
const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Model ilişkileri kurulacaksa burada
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Dışa aktar
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
