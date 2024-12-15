// models/Discount.js

module.exports = (sequelize, DataTypes) => {
  const Discount = sequelize.define('Discount', {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: 'Name of the discount, e.g., "Summer Sale"',
    },
    rate: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: 'Discount rate as a percentage or fixed amount',
    },
    type: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false,
      validate: {
        isIn: [['percentage', 'fixed']],
      },
      comment: 'Type of discount',
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether the discount is active',
    },
  }, {
    tableName: 'discounts',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['store_id', 'name', 'deleted_at'],
        name: 'discounts_store_id_name_deleted_at_unique',
      },
    ],
  });

  Discount.associate = (models) => {
    Discount.belongsTo(models.Store, { foreignKey: 'store_id', as: 'Store' });
    Discount.hasMany(models.Item, { foreignKey: 'discount_id', as: 'Items' });

    // If Discount is related to TaxRates, add the association
    // Discount.belongsTo(models.TaxRates, { foreignKey: 'tax_id', as: 'TaxRate' });
  };

  return Discount;
};
