// // models/payment.js
// module.exports = (sequelize, DataTypes) => {
//     const Payment = sequelize.define('Payment', {
//       paymentProviderId: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       paymentStatus: {
//         type: DataTypes.ENUM('pending', 'completed', 'failed'),
//         allowNull: false,
//       },
//       transactionId: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//       },
//     });
  
//     Payment.associate = function(models) {
//       Payment.belongsTo(models.Invoice, { foreignKey: 'invoiceId' });
//     };
  
//     return Payment;
//   };
  