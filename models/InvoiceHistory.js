// models/InvoiceHistory.js

module.exports = (sequelize, DataTypes) => {
    const InvoiceHistory = sequelize.define('InvoiceHistory', {
      store_id: { type: DataTypes.INTEGER, allowNull: false },
      invoice_id: DataTypes.INTEGER,
      status: DataTypes.STRING,
      notify: DataTypes.BOOLEAN,
      description: DataTypes.TEXT,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE,
    }, {
      tableName: 'invoice_histories',
      timestamps: true,
      paranoid: true,
      underscored: true,
    });
  
    InvoiceHistory.associate = (models) => {
      InvoiceHistory.belongsTo(models.Store, { foreignKey: 'store_id' });
      InvoiceHistory.belongsTo(models.Invoice, { foreignKey: 'invoice_id' });
    };
  
    return InvoiceHistory;
  };
  