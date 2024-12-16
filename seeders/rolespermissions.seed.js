'use strict';

const { Role, Permission, RolePermission, sequelize } = require('../models');

const seedRolesAndPermissions = async () => {
  const transaction = await sequelize.transaction();
  try {
    // Permissions
    const permissions = [
      // Store Management
      { name: 'view_store', description: 'Can view store details' },
      { name: 'edit_store', description: 'Can edit store details' },
      { name: 'delete_store', description: 'Can delete a store' },
      { name: 'add_user_to_store', description: 'Can add a user to the store' },
      { name: 'remove_user_from_store', description: 'Can remove a user from the store' },
      { name: 'edit_user_role_in_store', description: 'Can edit a user\'s role in the store' },

      // Inventory Management
      { name: 'create_item', description: 'Can create items' },
      { name: 'edit_item', description: 'Can edit items' },
      { name: 'delete_item', description: 'Can delete items' },
      { name: 'view_item', description: 'Can view items' },

      // Invoices & Transactions
      { name: 'create_invoice', description: 'Can create invoices' },
      { name: 'edit_invoice', description: 'Can edit invoices' },
      { name: 'delete_invoice', description: 'Can delete invoices' },
      { name: 'view_invoice', description: 'Can view invoices' },
      { name: 'create_transaction', description: 'Can create transactions' },
      { name: 'view_transaction', description: 'Can view transactions' },

      // Financial & Reporting
      { name: 'view_financial_reports', description: 'Can view financial reports' },

      // Global (Non-Store)
      { name: 'manage_all_stores', description: 'Can manage all stores globally' },
      { name: 'manage_all_users', description: 'Can manage all users globally' },
      { name: 'manage_roles', description: 'Can manage roles globally' },
      { name: 'manage_permissions', description: 'Can manage permissions globally' },
    ];

    await Permission.bulkCreate(
      permissions.map(p => ({ ...p, created_at: new Date(), updated_at: new Date() })),
      { transaction }
    );

    // Roles
    const roles = [
      // Global Roles
      { name: 'super_admin', description: 'Has all permissions system-wide' },
      { name: 'admin', description: 'Can manage stores, users, roles, and permissions globally' },
      { name: 'support_agent', description: 'Can view global data for support, limited changes' },
      { name: 'user', description: 'Basic user with no global permissions' },

      // Store-Specific Roles
      { name: 'owner', description: 'Full control over a specific store' },
      { name: 'manager', description: 'Manages store settings, inventory, and invoices' },
      { name: 'employee', description: 'Can handle daily operations but limited store settings' },
      { name: 'cashier', description: 'Handles point-of-sale invoices and transactions' },
      { name: 'inventory_manager', description: 'Manages store items and stock' },
      { name: 'accountant', description: 'Views and manages financial data and reports' },
      { name: 'viewer', description: 'Read-only access to store data' },
    ];

    await Role.bulkCreate(
      roles.map(r => ({ ...r, created_at: new Date(), updated_at: new Date() })),
      { transaction }
    );

    // Fetch inserted roles and permissions
    const insertedRoles = await Role.findAll({ transaction });
    const insertedPermissions = await Permission.findAll({ transaction });

    const roleMap = {};
    insertedRoles.forEach(r => { roleMap[r.name] = r.id; });

    const permMap = {};
    insertedPermissions.forEach(p => { permMap[p.name] = p.id; });

    // Helper function to build role-permission pairs
    const rp = (roleName, permNames) => {
      const roleId = roleMap[roleName];
      return permNames.map(pn => ({
        role_id: roleId,
        permission_id: permMap[pn],
        created_at: new Date(),
        updated_at: new Date()
      }));
    };

    // Assign permissions to roles
    const allPermissionNames = Object.keys(permMap);

    const superAdminRP = rp('super_admin', allPermissionNames);
    const adminRP = rp('admin', [
      'manage_all_stores',
      'manage_all_users',
      'manage_roles',
      'manage_permissions',
      'view_store', 'edit_store', 'delete_store',
      'add_user_to_store', 'remove_user_from_store', 'edit_user_role_in_store',
      'create_item', 'edit_item', 'delete_item', 'view_item',
      'create_invoice', 'edit_invoice', 'delete_invoice', 'view_invoice',
      'create_transaction', 'view_transaction', 'view_financial_reports'
    ]);

    const supportAgentRP = rp('support_agent', [
      'view_store', 'view_item', 'view_invoice', 'view_transaction', 'view_financial_reports'
    ]);

    const userRP = []; // no global permissions

    const ownerRP = rp('owner', [
      'view_store', 'edit_store', 'delete_store',
      'add_user_to_store', 'remove_user_from_store', 'edit_user_role_in_store',
      'create_item', 'edit_item', 'delete_item', 'view_item',
      'create_invoice', 'edit_invoice', 'delete_invoice', 'view_invoice',
      'create_transaction', 'view_transaction', 'view_financial_reports'
    ]);

    const managerRP = rp('manager', [
      'view_store', 'edit_store',
      'add_user_to_store', 'edit_user_role_in_store',
      'create_item', 'edit_item', 'delete_item', 'view_item',
      'create_invoice', 'edit_invoice', 'delete_invoice', 'view_invoice',
      'create_transaction', 'view_transaction'
    ]);

    const employeeRP = rp('employee', [
      'view_store', 'view_item',
      'create_item', 'edit_item', // if employees can manage items
      'create_invoice', 'edit_invoice', 'view_invoice',
      'create_transaction', 'view_transaction'
    ]);

    const cashierRP = rp('cashier', [
      'view_store', 'view_item',
      'create_invoice', 'view_invoice', 'create_transaction', 'view_transaction'
    ]);

    const inventoryManagerRP = rp('inventory_manager', [
      'view_store',
      'create_item', 'edit_item', 'delete_item', 'view_item',
      'view_invoice', 'view_transaction'
    ]);

    const accountantRP = rp('accountant', [
      'view_store',
      'view_invoice', 'view_transaction', 'view_financial_reports'
    ]);

    const viewerRP = rp('viewer', [
      'view_store', 'view_item', 'view_invoice', 'view_transaction'
    ]);

    const rolePermissionsToInsert = [
      ...superAdminRP,
      ...adminRP,
      ...supportAgentRP,
      ...userRP,
      ...ownerRP,
      ...managerRP,
      ...employeeRP,
      ...cashierRP,
      ...inventoryManagerRP,
      ...accountantRP,
      ...viewerRP
    ];

    await RolePermission.bulkCreate(rolePermissionsToInsert, { transaction });

    await transaction.commit();
    console.log('Roles and permissions seeded successfully');
  } catch (err) {
    await transaction.rollback();
    console.error('Error seeding roles and permissions:', err);
  }
};

module.exports = { seedRolesAndPermissions };
