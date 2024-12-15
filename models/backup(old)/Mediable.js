// models/Mediable.js

module.exports = (sequelize, DataTypes) => {
    const Mediable = sequelize.define('Mediable', {
      media_id: { type: DataTypes.INTEGER, primaryKey: true },
      mediable_type: { type: DataTypes.STRING, primaryKey: true },
      mediable_id: { type: DataTypes.INTEGER, primaryKey: true },
      tag: { type: DataTypes.STRING, primaryKey: true },
      order: DataTypes.INTEGER,
    }, {
      tableName: 'mediables',
      timestamps: false,
      underscored: true,
    });
  
    return Mediable;
  };
  