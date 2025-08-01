// models/Report.js
module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reportName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    generatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    generatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  }, {
    tableName: 'reports',
    timestamps: false,
  });

  Report.associate = (models) => {
    // Eğer kullanıcı ile ilişki olursa burada ekle
    // Report.belongsTo(models.User, { foreignKey: 'generatedBy' });
  };

  return Report;
};
