'use strict';

const { Role } = require('../models');

const seedRoles = async () => {
    try {
        const roles = [
            { name: 'Admin', description: 'Full control over the platform' },
            { name: 'Merchant', description: 'Store owner with full control over store' },
            { name: 'Employee', description: 'Perform operational tasks' },
            { name: 'Auditor', description: 'View-only access to reports' },
            { name: 'Customer', description: 'Basic user with limited access to invoices' },
        ];

        for (const role of roles) {
            await Role.create(role);
        }

        console.log('Roles seeded successfully');
    } catch (err) {
        console.error('Error seeding roles:', err);
    }
};

module.exports = { seedRoles };
