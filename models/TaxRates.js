// models/TaxRates.js

module.exports = (sequelize, DataTypes) => {
    const TaxRates = sequelize.define('TaxRates', {
      name: DataTypes.STRING,
      rate: DataTypes.DOUBLE,
      effective_from: DataTypes.DATE,
      effective_to: DataTypes.DATE,
    }, {
      tableName: 'tax_rates',
      timestamps: true,
      paranoid: true,
      underscored: true,
    });
  
    TaxRates.associate = (models) => {
      TaxRates.belongsTo(models.Store, { foreignKey: 'store_id' });
      TaxRates.hasMany(models.Item, { foreignKey: 'tax_id' });
    };
  
    return TaxRates;
  };

  // should we keep this as tax_rates or just taxes?
  // remember to add connections to other models.
  