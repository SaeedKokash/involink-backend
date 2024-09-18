module.exports = (sequelize, DataTypes) => {
  const RequestToPay = sequelize.define('RequestToPay', {
    invoice_id: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      // field: 'invoice_id',
    },
    session_id: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      // field: 'session_id',
    },
    msgId: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      // field: 'msgId',
    },
    purpose: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      // field: 'purpose',
    },
    amount: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      // field: 'amount',
    },
    receiverType: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      // field: 'receiverType',
    },
    senderType: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      // field: 'senderType',
    },
    // Custom mappings for timestamps
    createdAt: {
      type: DataTypes.DATE,
      // field: 'created_at', // Map to your DB column 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      // field: 'updated_at', // Map to your DB column 'updated_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      // field: 'deleted_at', // Map to your DB column 'deleted_at'
    },
    extraData: {
      type: DataTypes.JSON,
      // allowNull: false,
      // field: 'extraData',
    },
  }, {
    // tableName: 'request_to_pay', // Explicitly specify the table name
    timestamps: true, // Enable Sequelize to automatically manage `createdAt` and `updatedAt`
    paranoid: true,  // Enable `deletedAt` to perform soft deletes
    // underscored: true, // Use underscored naming conventions
  });

  RequestToPay.associate = function (models) {
    RequestToPay.belongsTo(models.Invoice, { foreignKey: 'invoice_id' });
    // RequestToPay.belongsTo(models.Session, { foreignKey: 'session_id' });
  };

  return RequestToPay;
};

