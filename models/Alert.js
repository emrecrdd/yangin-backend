// models/Alert.js
module.exports = (sequelize, DataTypes) => {
  const Alert = sequelize.define('Alert', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sensorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'sensors',
        key: 'id',
      },
    },
    alertType: {
      type: DataTypes.ENUM('fire', 'temperature', 'smoke', 'humidity', 'suspicious'),
      allowNull: false,
    },
    alertValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'resolved'),
      defaultValue: 'active',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
  }, {
    tableName: 'alerts',
    timestamps: true,
  });

  Alert.associate = (models) => {
    Alert.belongsTo(models.Sensor, { foreignKey: 'sensorId',  onDelete: 'CASCADE',  });
  };

  return Alert;
};
