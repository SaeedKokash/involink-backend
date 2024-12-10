// models/Media.js

module.exports = (sequelize, DataTypes) => {
  const Media = sequelize.define('Media', {
    disk: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: 'Disk/storage identifier, e.g., "local", "s3"',
    },
    directory: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: 'Directory path where the media is stored',
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: 'Name of the media file',
    },
    extension: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: 'File extension, e.g., "jpg", "png"',
    },
    mime_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: 'MIME type of the media, e.g., "image/jpeg"',
    },
    aggregate_type: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Aggregate category or type for the media',
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: 'Size of the media file in bytes',
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
      comment: 'URL or path to access the media',
    },
  }, {
    tableName: 'media',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['disk', 'directory', 'filename', 'deleted_at'],
        name: 'media_disk_directory_filename_deleted_at_unique',
      },
    ],
  });

  Media.associate = (models) => {
    Media.belongsToMany(models.Item, {
      through: models.ItemMedia,
      as: 'Items',
      foreignKey: 'media_id',
      otherKey: 'item_id',
      constraints: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Media.belongsToMany(models.Store, {
      through: models.StoreMedia,
      as: 'Stores',
      foreignKey: 'media_id',
      otherKey: 'store_id',
      constraints: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Media.belongsToMany(models.User, {
      through: models.UserMedia,
      as: 'Users',
      foreignKey: 'media_id',
      otherKey: 'user_id',
      constraints: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Media.belongsToMany(models.Invoice, {
      through: models.InvoiceMedia,
      as: 'Invoices',
      foreignKey: 'media_id',
      otherKey: 'invoice_id',
      constraints: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Media;
};
