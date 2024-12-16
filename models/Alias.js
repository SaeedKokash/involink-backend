// models/Alias.js

module.exports = (sequelize, DataTypes) => {
  const Alias = sequelize.define('Alias', {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: 'Type of alias, e.g., "email", "alias", "phone"',
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: 'Value of the alias, e.g., "user@example.com"',
    },

  }, {
    tableName: 'aliases',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['type', 'value', 'deleted_at'],
        name: 'aliases_type_value_deleted_at_unique',
      },
    ],
  });

  Alias.associate = (models) => {
    // Many-to-Many: Alias <-> Contact through ContactAlias
    Alias.belongsToMany(models.Contact, {
      through: models.ContactAlias,
      as: 'Contacts',
      foreignKey: 'alias_id',
      otherKey: 'contact_id',
      constraints: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Many-to-Many: Alias <-> Account through AccountAlias
    Alias.belongsToMany(models.Account, {
      through: models.AccountAlias,
      as: 'Accounts',
      foreignKey: 'alias_id',
      otherKey: 'account_id',
      constraints: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Alias;
};
