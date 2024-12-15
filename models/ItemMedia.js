// models/ItemMedia.js

module.exports = (sequelize, DataTypes) => {
  const ItemMedia = sequelize.define('ItemMedia', {
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      primaryKey: true,
    },
    media_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'media',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      primaryKey: true,
    },

    tag: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Tag for categorizing the media, e.g., "thumbnail", "gallery"',
    },
    media_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: 'Order of the media in the item\'s media list',
    },
  }, {
    tableName: 'item_media',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['item_id', 'media_id'],
        name: 'item_media_item_id_media_id_unique',
      },
    ],
  });

  ItemMedia.associate = (models) => {
    ItemMedia.belongsTo(models.Item, { foreignKey: 'item_id', as: 'Item' });
    ItemMedia.belongsTo(models.Media, { foreignKey: 'media_id', as: 'Media' });
  };

  return ItemMedia;
};
