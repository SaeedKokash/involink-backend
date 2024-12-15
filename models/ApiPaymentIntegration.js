// models/ApiPaymentIntegration.js

module.exports = (sequelize, DataTypes) => {
  const ApiPaymentIntegration = sequelize.define('ApiPaymentIntegration', {
    provider_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'providers',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'pending'),
      allowNull: false,
      defaultValue: 'inactive',
      validate: {
        isIn: [['active', 'inactive', 'pending']],
      },
      comment: 'Status of the API payment integration',
    },

  }, {
    tableName: 'api_payment_integrations',
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

  ApiPaymentIntegration.associate = (models) => {
    ApiPaymentIntegration.belongsTo(models.Provider, { foreignKey: 'provider_id', as: 'Provider' });
  };

  return ApiPaymentIntegration;
};
