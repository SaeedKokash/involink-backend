'use strict';

const { Permission } = require('../models');

const seedPermissions = async () => {
    try {
        const permissions = [
            { name: 'Manage Users', description: 'Manage user accounts and roles' },
            { name: 'Manage Stores', description: 'Create, update, and delete stores' },
            { name: 'Manage Inventory', description: 'Add, update, and delete inventory items' },
            { name: 'Manage Invoices', description: 'Create, send, and track invoices' },
            { name: 'Manage Contacts', description: 'Manage customer and supplier contacts' },
            { name: 'View Reports', description: 'View financial and operational reports' },
            { name: 'Manage Permissions', description: 'Control roles and permissions' },
            { name: 'Request Payments', description: 'Initiate and track payment requests' },
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
