'use strict';

const { Permission } = require('../models');

const seedPermissions = async () => {
    try {
        const permissions = [
            // User Management
            { name: 'create_user', description: 'Create new users' },
            { name: 'view_user', description: 'View user details' },
            { name: 'update_user', description: 'Update user details' },
            { name: 'delete_user', description: 'Remove users' },
            { name: 'assign_roles', description: 'Assign roles to users' },
            { name: 'manage_permissions', description: 'Create or update permissions' },

            // Store Management
            { name: 'create_store', description: 'Create new stores' },
            { name: 'view_store', description: 'View store information' },
            { name: 'update_store', description: 'Update store details' },
            { name: 'delete_store', description: 'Remove stores' },
            { name: 'manage_store_media', description: 'Manage store-related media' },

            // Invoice and Financial Management
            { name: 'create_invoice', description: 'Generate new invoices' },
            { name: 'view_invoice', description: 'View invoice details' },
            { name: 'update_invoice', description: 'Update invoice information' },
            { name: 'delete_invoice', description: 'Cancel or remove invoices' },
            { name: 'process_transaction', description: 'Handle payment transactions' },
            { name: 'view_transaction', description: 'View financial transactions' },
            { name: 'manage_tax_rates', description: 'Add or modify tax rates' },
            { name: 'view_own_invoices', description: 'View own invoices' },

            // Item Management
            { name: 'create_item', description: 'Add new items' },
            { name: 'view_item', description: 'View item details' },
            { name: 'update_item', description: 'Modify item details' },
            { name: 'delete_item', description: 'Remove items' },
            { name: 'manage_item_media', description: 'Manage item images or media' },

            // Contact Management
            { name: 'create_contact', description: 'Add new contacts' },
            { name: 'view_contact', description: 'View contact details' },
            { name: 'update_contact', description: 'Modify contact information' },
            { name: 'delete_contact', description: 'Remove contacts' },

            // Notification Management
            { name: 'create_notification', description: 'Send notifications' },
            { name: 'view_notification', description: 'View notifications' },
            { name: 'delete_notification', description: 'Remove notifications' },

            // Media Management
            { name: 'upload_media', description: 'Upload media files' },
            { name: 'view_media', description: 'View media files' },
            { name: 'delete_media', description: 'Remove media files' },

            // Tagging and Categorization
            { name: 'create_tag', description: 'Add new tags' },
            { name: 'view_tag', description: 'View tags' },
            { name: 'update_tag', description: 'Modify tags' },
            { name: 'delete_tag', description: 'Remove tags' },

            // API and Payment Integration
            { name: 'manage_api_integration', description: 'Add or modify API integrations' },
            { name: 'view_api_integration', description: 'View integration details' },

            // Account and Alias Management
            { name: 'create_account', description: 'Add accounts' },
            { name: 'view_account', description: 'View account details' },
            { name: 'update_account', description: 'Modify account details' },
            { name: 'delete_account', description: 'Remove accounts' },

            // Discount and Tax Management
            { name: 'create_discount', description: 'Add new discounts' },
            { name: 'view_discount', description: 'View discount details' },
            { name: 'update_discount', description: 'Modify discounts' },
            { name: 'delete_discount', description: 'Remove discounts' },
            { name: 'manage_tax_rates', description: 'Configure tax rates' },
        ];

        for (const permission of permissions) {
            await Permission.create(permission);
        }

        console.log('Permissions seeded successfully');
    } catch (err) {
        console.error('Error seeding permissions:', err);
    }
};

module.exports = { seedPermissions };
