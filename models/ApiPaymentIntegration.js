// models/ApiPaymentIntegration.js

module.exports = (sequelize, DataTypes) => {
  const ApiPaymentIntegration = sequelize.define('ApiPaymentIntegration', {
    provider_id: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'inactive' }, // status is int or string? if string, will it be enum?

  }, {
    tableName: 'api_payment_integrations',
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

  ApiPaymentIntegration.associate = (models) => {
    ApiPaymentIntegration.belongsTo(models.Provider, { foreignKey: 'provider_id' });
  };

  return ApiPaymentIntegration;
};
