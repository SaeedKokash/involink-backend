// models/Invoice.js

module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {
    store_id: { type: DataTypes.INTEGER, allowNull: false },
    invoice_number: { type: DataTypes.STRING, unique: 'store_invoice_deleted_at' },
    order_number: DataTypes.STRING,
    status: DataTypes.STRING,
    invoiced_at: DataTypes.DATE,
    due_at: DataTypes.DATE,
    amount: DataTypes.DOUBLE,
    currency_code: DataTypes.STRING,
    currency_rate: DataTypes.DOUBLE,
    category_id: DataTypes.INTEGER,
    contact_id: DataTypes.INTEGER,
    contact_name: DataTypes.STRING,
    contact_email: DataTypes.STRING,
    contact_tax_number: DataTypes.STRING,
    contact_phone: DataTypes.STRING,
    contact_address: DataTypes.TEXT,
    notes: DataTypes.TEXT,
    footer: DataTypes.TEXT,
    parent_id: DataTypes.INTEGER,
  }, {
    tableName: 'invoices',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['store_id', 'invoice_number', 'deleted_at'],
        name: 'invoices_store_id_invoice_number_deleted_at_unique',
      },
    ],
  });

  Invoice.associate = (models) => {
    Invoice.belongsTo(models.Store, { foreignKey: 'store_id' });
    Invoice.belongsTo(models.Contact, { foreignKey: 'contact_id' });
    Invoice.hasMany(models.InvoiceItem, { foreignKey: 'invoice_id' });
    Invoice.hasMany(models.InvoiceHistory, { foreignKey: 'invoice_id' });
    Invoice.hasOne(models.RequestToPay, { foreignKey: 'invoice_id' });
    Invoice.belongsToMany(models.Media, {
      through: models.Mediable,
      foreignKey: 'mediable_id', // The foreign key in 'Mediable' pointing to 'Invoice'
      otherKey: 'media_id',      // The foreign key in 'Mediable' pointing to 'Media'
      constraints: false,
    });
  };

  return Invoice;
};
