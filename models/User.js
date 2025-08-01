module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    // kolonlar örnek
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
    },
  }, {
    tableName: 'users',
    timestamps: true,
  });

  User.associate = (models) => {
    // ilişkiler varsa buraya
  };

  return User;
};
