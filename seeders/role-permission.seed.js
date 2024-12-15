'use strict';

const { Role, Permission, RolePermission } = require('../models');

const seedRolePermissions = async () => {
    try {
        const roles = await Role.findAll();
        const permissions = await Permission.findAll();

        const rolePermissionMappings = {
            Admin: ['Manage Users', 'Manage Stores', 'Manage Inventory', 'Manage Invoices', 'Manage Contacts', 'View Reports', 'Manage Permissions', 'Request Payments'],
            'Store Owner': ['Manage Stores', 'Manage Inventory', 'Manage Invoices', 'Manage Contacts', 'View Reports', 'Request Payments'],
            Employee: ['Manage Inventory', 'Manage Invoices', 'Manage Contacts'],
            Auditor: ['View Reports'],
        };

        for (const [roleName, permissionNames] of Object.entries(rolePermissionMappings)) {
            const role = roles.find(r => r.name === roleName);
            for (const permissionName of permissionNames) {
                const permission = permissions.find(p => p.name === permissionName);
                if (role && permission) {
                    await RolePermission.create({ role_id: role.id, permission_id: permission.id });
                }
            }
        }

        console.log('Role-Permission relationships seeded successfully');
    } catch (err) {
        console.error('Error seeding role-permission relationships:', err);
    }
};

module.exports = { seedRolePermissions };
