// models/StoreMedia.js

module.exports = (sequelize, DataTypes) => {
  const StoreMedia = sequelize.define('StoreMedia', {
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'stores',
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
    url: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
      comment: 'URL to the media resource',
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Tag for categorizing the media, e.g., "logo", "banner"',
    },
    media_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: 'Order of the media in the store\'s media list',
    },
  }, {
    tableName: 'store_media',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['store_id', 'media_id'],
        name: 'store_media_store_id_media_id_unique',
      },
    ],
  });

  StoreMedia.associate = (models) => {
    StoreMedia.belongsTo(models.Store, { foreignKey: 'store_id', as: 'Store' });
    StoreMedia.belongsTo(models.Media, { foreignKey: 'media_id', as: 'Media' });
  };

  return StoreMedia;
};
