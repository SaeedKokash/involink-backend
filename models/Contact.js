// models/Contact.js

module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'stores',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    type: {
      type: DataTypes.ENUM('customer', 'supplier', 'other'),
      allowNull: false,
      defaultValue: 'other',
      validate: {
        isIn: [['customer', 'supplier', 'other']],
      },
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true, // Set to false if email is required
      validate: {
        isEmail: true,
      },
      // Removed unique constraint here
    },

    tax_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[+]?[0-9\s\-()]+$/, // Simple phone number validation
      },
    },
    street_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zip_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },

    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },

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
    Contact.belongsTo(models.Store, { foreignKey: 'store_id', as: 'Store' });
    Contact.hasMany(models.Transaction, { foreignKey: 'contact_id', as: 'Transactions' });
    Contact.hasMany(models.Invoice, { foreignKey: 'contact_id', as: 'Invoices' });

    // Many-to-Many: Contact <-> Alias through ContactAlias
    Contact.belongsToMany(models.Alias, {
      through: models.ContactAlias,
      as: 'Aliases',
      foreignKey: 'contact_id',
      otherKey: 'alias_id',
      constraints: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Contact;
};
