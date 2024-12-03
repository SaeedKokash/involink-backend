// models/Provider.js

module.exports = (sequelize, DataTypes) => {
  const Provider = sequelize.define('Provider', {
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('bank', 'PSP', 'payment_gateway', 'other'), defaultValue: 'other' },
  }, {
    tableName: 'providers',
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

  Provider.associate = (models) => {
    Provider.hasMany(models.ApiPaymentIntegration, { foreignKey: 'provider_id' });
  };

  return Provider;
};
