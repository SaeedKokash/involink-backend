// models/Contact.js

module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define('Contact', {
      store_id: { type: DataTypes.INTEGER, allowNull: false },
      type: DataTypes.STRING,
      name: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: 'store_type_email_deleted_at' },
      user_id: DataTypes.INTEGER,
      tax_number: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.TEXT,
      website: DataTypes.STRING,
      currency_code: DataTypes.STRING,
      enabled: DataTypes.BOOLEAN,
      reference: DataTypes.STRING,
    }, {
      tableName: 'contacts',
      timestamps: true,
      paranoid: true,
      underscored: true,
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
      Contact.hasMany(models.Invoice, { foreignKey: 'contact_id' });
    };
  
    return Contact;
  };
  