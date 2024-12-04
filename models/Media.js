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

      path: DataTypes.STRING, // Add this line, do we need this?

    }, {
      tableName: 'media',
      timestamps: true,
      paranoid: true,
      underscored: true,
    });
  
    // media has relation with: 
    // 1. many to many relation with Item through item_media (item_id, media_id)
    // 2. many to many relation with store through store_media (store_id, media_id)
    // 3. many to many relation with user through user_media (user_id, media_id)

    Media.associate = (models) => {
      Media.belongsToMany(models.Item, {
        through: models.ItemMedia,
        foreignKey: 'media_id',    // The foreign key in 'ItemMedia' pointing to 'Media'
        otherKey: 'item_id',   // The foreign key in 'ItemMedia' pointing to 'Item'
        constraints: false,
      });

      Media.belongsToMany(models.Store, {
        through: models.StoreMedia,
        foreignKey: 'media_id',    // The foreign key in 'StoreMedia' pointing to 'Media'
        otherKey: 'store_id',   // The foreign key in 'StoreMedia' pointing to 'Store'
        constraints: false,
      });

      Media.belongsToMany(models.User, {
        through: models.UserMedia,
        foreignKey: 'media_id',    // The foreign key in 'UserMedia' pointing to 'Media'
        otherKey: 'user_id',   // The foreign key in 'UserMedia' pointing to 'User'
        constraints: false,
      });
    }

  
    return Media;
  };
  