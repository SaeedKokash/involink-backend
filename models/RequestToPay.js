// models/RequestToPay.js

module.exports = (sequelize, DataTypes) => {
  const RequestToPay = sequelize.define('RequestToPay', {

    invoice_id: DataTypes.INTEGER,
    transaction_id: DataTypes.INTEGER,

    reference_id: DataTypes.STRING,
    
    msgId: DataTypes.INTEGER,

    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
      defaultValue: 'pending',
    },
  }, {
    tableName: 'request_to_pay',
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

  RequestToPay.associate = (models) => {
    RequestToPay.belongsTo(models.Invoice, { foreignKey: 'invoice_id' });
    RequestToPay.belongsTo(models.Transaction, { foreignKey: 'transaction_id' });
  };

  return RequestToPay;
};
