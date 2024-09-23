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
    }, {
      tableName: 'media',
      timestamps: true,
      paranoid: true,
      underscored: true,
    });
  
    Media.associate = (models) => {
      Media.belongsToMany(models.Invoice, {
        through: {
          model: models.Mediable,
          unique: false,
          scope: {
            mediable_type: 'Invoice',
          },
        },
        foreignKey: 'media_id',
        constraints: false,
      });
      // Add associations with other models if needed
    };
  
    return Media;
  };
  