// models/TaxRates.js

module.exports = (sequelize, DataTypes) => {
  const TaxRates = sequelize.define('TaxRates', {
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
      comment: 'Name of the tax rate, e.g., "VAT 5%"',
    },
    rate: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: 'Tax rate percentage, e.g., 5 for 5%',
    },
    type: {
      type: DataTypes.ENUM('VAT', 'GST', 'Sales Tax', 'Other'),
      allowNull: false,
      defaultValue: 'VAT',
      validate: {
        isIn: [['VAT', 'GST', 'Sales Tax', 'Other']],
      },
      comment: 'Type of tax rate',
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether the tax rate is active',
    },
  }, {
    tableName: 'tax_rates',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['store_id', 'name', 'deleted_at'],
        name: 'tax_rates_store_id_name_deleted_at_unique',
      },
    ],
  });

  TaxRates.associate = (models) => {
    TaxRates.belongsTo(models.Store, { foreignKey: 'store_id', as: 'Store' });
    TaxRates.hasMany(models.Item, { foreignKey: 'tax_id', as: 'Items' });
  };

  return TaxRates;
};
