// models/RequestToPay.js

module.exports = (sequelize, DataTypes) => {
  const RequestToPay = sequelize.define('RequestToPay', {
    rtp_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    invoice_id: DataTypes.INTEGER,
    session_id: DataTypes.INTEGER,
    msgId: DataTypes.INTEGER,
    purpose: DataTypes.INTEGER,
    amount: DataTypes.DOUBLE,
    receiverType: DataTypes.INTEGER,
    senderType: DataTypes.INTEGER,
    extraData: DataTypes.JSON,
    // Add a status field
    status: {
      type: DataTypes.ENUM,
      values: ['pending', 'approved', 'rejected', 'completed'],
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
    // If you have a Session model, you can associate it here
    // RequestToPay.belongsTo(models.Session, { foreignKey: 'session_id' });
  };

  return RequestToPay;
};
