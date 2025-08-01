// models/Sensor.js
module.exports = (sequelize, DataTypes) => {
  const Sensor = sequelize.define('Sensor', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(9,6),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(9,6),
      allowNull: false,
    },
    temperature: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    smoke: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    humidity: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    regionId: {
  type: DataTypes.UUID,
  allowNull: true, // veya false — bölgeye bağlılık zorunluysa
},
    status: {
      type: DataTypes.ENUM('active', 'warning', 'pending', 'resolved'),
      defaultValue: 'active',
    },
      lastDataReceivedAt: {               // <--- Burayı ekliyoruz
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      comment: "Sensörün en son veri aldığı zaman",
    },
  }, {
    tableName: 'sensors',
    timestamps: true,
  });

  Sensor.associate = (models) => {
    Sensor.belongsTo(models.Region, { foreignKey: 'regionId' });
    Sensor.hasMany(models.Alert, { foreignKey: 'sensorId', onDelete: 'CASCADE',  });
  };

  return Sensor;
};
