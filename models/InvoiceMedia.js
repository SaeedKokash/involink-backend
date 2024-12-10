// models/InvoiceMedia.js

module.exports = (sequelize, DataTypes) => {
  const InvoiceMedia = sequelize.define('InvoiceMedia', {
    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'invoices',
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
      comment: 'Tag for categorizing the media',
    },
    media_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: 'Order of the media in the invoice',
    },
  }, {
    tableName: 'invoice_media',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['invoice_id', 'media_id'],
        name: 'invoice_media_invoice_id_media_id_unique',
      },
    ],
  });

  InvoiceMedia.associate = (models) => {
    InvoiceMedia.belongsTo(models.Invoice, { foreignKey: 'invoice_id', as: 'Invoice' });
    InvoiceMedia.belongsTo(models.Media, { foreignKey: 'media_id', as: 'Media' });
  };

  return InvoiceMedia;
};
