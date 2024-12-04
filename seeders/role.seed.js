'use strict';

const { Role } = require('../models');

const seedRoles = async () => {
    try {
        const roles = [
            { name: 'Admin', description: 'Full control over the platform' },
            { name: 'Store Owner', description: 'Manage stores and operations' },
            { name: 'Employee', description: 'Perform operational tasks' },
            { name: 'Auditor', description: 'View-only access to reports' },
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
