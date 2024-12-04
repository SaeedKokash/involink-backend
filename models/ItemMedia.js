// models/ItemMedia.js

module.exports = (sequelize, DataTypes) => {
    const ItemMedia = sequelize.define('ItemMedia', {
      item_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
      media_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },

      tag: DataTypes.STRING, // what is the tag for?
      media_order: DataTypes.INTEGER, // what is the media_order for?

    }, {
      tableName: 'item_media',
      timestamps: true,
      paranoid: true,
      underscored: true,
    });

    // itemstore_media is a many to many relation with item and media

    ItemMedia.associate = (models) => {
      ItemMedia.belongsTo(models.Item, { foreignKey: 'item_id' });
      ItemMedia.belongsTo(models.Media, { foreignKey: 'media_id' });
    }
      
    return ItemMedia;
  };
  