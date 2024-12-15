// models/Media.js

module.exports = (sequelize, DataTypes) => {
    const Media = sequelize.define('Media', {
      disk: DataTypes.STRING,
      directory: DataTypes.STRING,
      filename: DataTypes.STRING,
      extension: DataTypes.STRING,
      mime_type: DataTypes.STRING,
      aggregate_type: DataTypes.STRING,
      size: DataTypes.INTEGER,
      path: DataTypes.STRING, // Add this line
    }, {
      tableName: 'media',
      timestamps: true,
      paranoid: true,
      underscored: true,
    });
  
    Media.associate = (models) => {
      Media.belongsToMany(models.Invoice, {
        through: models.Mediable,
        foreignKey: 'media_id',    // The foreign key in 'Mediable' pointing to 'Media'
        otherKey: 'mediable_id',   // The foreign key in 'Mediable' pointing to 'Invoice'
        constraints: false,
      });
    };
  
    return Media;
  };
  