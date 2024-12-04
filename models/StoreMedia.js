// models/StoreMedia.js

module.exports = (sequelize, DataTypes) => {
    const StoreMedia = sequelize.define('StoreMedia', {
      store_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
      media_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },

      tag: DataTypes.STRING, // what is the tag for?
      media_order: DataTypes.INTEGER, // what is the media_order for?

    }, {
      tableName: 'store_media',
      timestamps: true,
      paranoid: true,
      underscored: true,
    });

    // store_media is a many to many relation with store and media

    StoreMedia.associate = (models) => {
      StoreMedia.belongsTo(models.Store, { foreignKey: 'store_id' });
      StoreMedia.belongsTo(models.Media, { foreignKey: 'media_id' });
    }
      
    return StoreMedia;
  };
  