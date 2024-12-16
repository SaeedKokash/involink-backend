'use strict';

const { Role, Permission } = require('../models');

const seedRolePermissions = async () => {
    try {
        const roles = await Role.findAll();
        const permissions = await Permission.findAll();

        // Role-to-permission mapping
        const rolePermissionMapping = {
            Admin: permissions.map(permission => permission.name), // Admin gets all permissions

            Merchant: [
                // Store Management
                'create_store', 'view_store', 'update_store', 'delete_store', 'manage_store_media',
                // Item Management
                'create_item', 'view_item', 'update_item', 'delete_item', 'manage_item_media',
                // Invoice Management
                'create_invoice', 'view_invoice', 'update_invoice', 'delete_invoice', 'process_transaction', 'view_transaction',
                // Contact Management
                'create_contact', 'view_contact', 'update_contact', 'delete_contact',
                // Media Management
                'upload_media', 'view_media', 'delete_media',
                // Discount and Tax
                'manage_tax_rates', 'create_discount', 'view_discount', 'update_discount', 'delete_discount',
                // Account Management
                'create_account', 'view_account', 'update_account', 'delete_account',
                // Notification Management
                'create_notification', 'view_notification', 'delete_notification',
                // Tagging and Categorization
                'create_tag', 'view_tag', 'update_tag', 'delete_tag',

            ],

            Employee: [
                // Item Management
                'view_item', 'update_item', 'create_item',
                // Invoice Management
                'create_invoice', 'view_invoice', 'process_transaction',
                // Contact Management
                'view_contact', 'update_contact', 'create_contact',
                // Notification Management
                'create_notification', 'view_notification', 'delete_notification',
                // Media Management
                'upload_media', 'view_media', 'delete_media',
            ],

            Customer: [
                // User Management (self only)
                'view_user', 'update_user',

                // Invoice Management
                'view_own_invoices',
            ],
        };

        // Assign permissions to roles
        for (const [roleName, permissionNames] of Object.entries(rolePermissionMapping)) {
            const role = roles.find(r => r.name === roleName);
            if (role) {
                for (const permissionName of permissionNames) {
                    const permission = permissions.find(p => p.name === permissionName);
                    if (permission) {
                        await role.addPermission(permission);
                    }
                }
            }
        }

        console.log('Role-Permissions seeded successfully');
    } catch (err) {
        console.error('Error seeding role-permissions:', err);
    }
};

module.exports = { seedRolePermissions };
