// models/Provider.js

module.exports = (sequelize, DataTypes) => {
  const Provider = sequelize.define('Provider', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: 'Name of the provider, e.g., "Bank of America"',
    },
    type: {
      type: DataTypes.ENUM('bank', 'PSP', 'payment_gateway', 'other'),
      allowNull: false,
      defaultValue: 'other',
      validate: {
        isIn: [['bank', 'PSP', 'payment_gateway', 'other']],
      },
      comment: 'Type of provider',
    },
  }, {
    tableName: 'providers',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['name', 'deleted_at'],
        name: 'providers_name_deleted_at_unique',
      },
    ],
  });

  Provider.associate = (models) => {
    Provider.hasMany(models.ApiPaymentIntegration, { foreignKey: 'provider_id', as: 'ApiPaymentIntegrations' });
  };

  return Provider;
};
