// models/Region.js
module.exports = (sequelize, DataTypes) => {
  const Region = sequelize.define('Region', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
   boundary: {
  type: DataTypes.JSONB, // veya DataTypes.TEXT
  allowNull: true,
},
  }, {
    tableName: 'regions',
    timestamps: true,
  });

  Region.associate = (models) => {
    Region.hasMany(models.Sensor, { foreignKey: 'regionId' });
  };

  return Region;
};
