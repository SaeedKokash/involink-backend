// models/ContactAlias.js

module.exports = (sequelize, DataTypes) => {
  const ContactAlias = sequelize.define('ContactAlias', {
    alias_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'aliases',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      primaryKey: true,
    },
    contact_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'contacts',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      primaryKey: true,
    },

  }, {
    tableName: 'contact_aliases',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['contact_id', 'alias_id'],
        name: 'contact_aliases_contact_id_alias_id_unique',
      },
    ],
  });

  ContactAlias.associate = (models) => {
    ContactAlias.belongsTo(models.Alias, { foreignKey: 'alias_id', as: 'Alias' });
    ContactAlias.belongsTo(models.Contact, { foreignKey: 'contact_id', as: 'Contact' });
  };

  return ContactAlias;
};
