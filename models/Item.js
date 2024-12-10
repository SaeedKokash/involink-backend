// models/Item.js

module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'stores',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    tax_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tax_rates',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    discount_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'discounts',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: 'Name of the item',
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Stock Keeping Unit, unique per store',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description of the item',
    },

    // Images are handled via Media and ItemMedia

    sale_price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: 'Selling price of the item',
    },
    purchase_price: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      validate: {
        min: 0,
      },
      comment: 'Purchase price of the item',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
      comment: 'Available quantity of the item',
    },

    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether the item is active',
    },
  }, {
    tableName: 'items',
    timestamps: true,
    paranoid: true,
    underscored: true,

    indexes: [
      {
        unique: true,
        fields: ['store_id', 'sku', 'deleted_at'],
        name: 'items_store_id_sku_deleted_at_unique',
      },
    ],
  });

  Item.associate = (models) => {
    Item.belongsTo(models.Store, { foreignKey: 'store_id', as: 'Store' });
    Item.belongsTo(models.TaxRates, { foreignKey: 'tax_id', as: 'TaxRate' });
    Item.belongsTo(models.Discount, { foreignKey: 'discount_id', as: 'Discount' });
    Item.hasMany(models.InvoiceItem, { foreignKey: 'item_id', as: 'InvoiceItems' });

    // Many-to-Many: Item <-> Media through ItemMedia
    Item.belongsToMany(models.Media, {
      through: models.ItemMedia,
      as: 'Media',
      foreignKey: 'item_id',
      otherKey: 'media_id',
      constraints: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Item;
};
