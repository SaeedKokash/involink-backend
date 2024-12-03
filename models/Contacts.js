// models/Contact.js

module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define('Contact', {
      store_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: DataTypes.INTEGER,

      type: {
        type: DataTypes.ENUM('customer', 'supplier', 'other'),
        defaultValue: 'other',
      },

      name: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: 'store_type_email_deleted_at' }, // what is the unique constraint here?

      tax_number: DataTypes.STRING,
      phone: DataTypes.STRING,
      street_address: DataTypes.STRING,
      city: DataTypes.STRING,
      zip_code: DataTypes.STRING,
      website: DataTypes.STRING,


      enabled: DataTypes.BOOLEAN,
      reference: DataTypes.STRING,
      notes: DataTypes.STRING,

      alias_type: {
        type: DataTypes.ENUM('alias', 'iban', 'mobile'),
      },
      alias_value: {
        type: DataTypes.STRING,
        unique: true, // should be unique?
      },

    }, {
      tableName: 'contacts',
      timestamps: true,
      paranoid: true,
      underscored: true,

      // what are the indexes here?
      indexes: [
        {
          unique: true,
          fields: ['store_id', 'type', 'email', 'deleted_at'],
          name: 'contacts_store_id_type_email_deleted_at_unique',
        },
      ],
    });
  
    Contact.associate = (models) => {
      Contact.belongsTo(models.Store, { foreignKey: 'store_id' });
      Contact.belongsTo(models.User, { foreignKey: 'user_id' });
      // check relation here with Transaction
      Contact.belongsTo(models.Transaction, { foreignKey: 'contact_id' });
      
      // check relation here with Invoice
      Contact.hasMany(models.Invoice, { foreignKey: 'contact_id' });
    };
  
    return Contact;
  };
  