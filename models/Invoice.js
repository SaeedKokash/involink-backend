// models/Invoice.js

module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {
    store_id: { type: DataTypes.INTEGER, allowNull: false },
    contact_id: DataTypes.INTEGER,

    invoice_number: { type: DataTypes.STRING, unique: 'store_invoice_deleted_at' }, // what is the unique constraint here?
    order_number: DataTypes.STRING, // to be filled by merchant
    status: {
      type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled'),
      defaultValue: 'draft',
    },

    invoiced_at: DataTypes.DATE,
    due_at: DataTypes.DATE,
    paid_at: DataTypes.DATE,

    amount: DataTypes.DOUBLE,
    currency_code: DataTypes.STRING,
   
    notes: DataTypes.TEXT,
    footer: DataTypes.TEXT,

  }, {
    tableName: 'invoices',
    timestamps: true,
    paranoid: true,
    underscored: true,
    // what are the indexes here?
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

    Invoice.hasMany(models.InvoiceHistory, { foreignKey: 'invoice_id' }); // check if we need this or not?

    Invoice.hasOne(models.RequestToPay, { foreignKey: 'invoice_id' }); // should we keep this as RequestToPay or PaymentRequest?

    Invoice.belongsToMany(models.Media, {
      through: models.Mediable,
      foreignKey: 'mediable_id', // The foreign key in 'Mediable' pointing to 'Invoice'
      otherKey: 'media_id',      // The foreign key in 'Mediable' pointing to 'Media'
      constraints: false,
    }); // is this correct?
  };

  return Invoice;
};
