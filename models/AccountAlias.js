// models/AccountAlias.js

module.exports = (sequelize, DataTypes) => {
    const AccountAlias = sequelize.define('AccountAlias', {
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
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'accounts',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        primaryKey: true,
      },
  
    }, {
      tableName: 'account_aliases',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['alias_id', 'account_id'],
          name: 'account_aliases_alias_id_account_id_unique',
        },
      ],
    });
  
    AccountAlias.associate = (models) => {
      // Each AccountAlias belongs to one Alias
      AccountAlias.belongsTo(models.Alias, {
        foreignKey: 'alias_id',
        as: 'Alias',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
  
      // Each AccountAlias belongs to one Account
      AccountAlias.belongsTo(models.Account, {
        foreignKey: 'account_id',
        as: 'Account',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    };
  
    return AccountAlias;
  };
  