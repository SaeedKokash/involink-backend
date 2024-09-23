'use strict';

const { Role } = require('../models');

const seedRoles = async () => {
    try {
        const roles = [
            {
                "name": "admin",
                "display_name": "Admin",
                "description": "Admin role has full access to all resources",
            },
            {
                "name": "merchant",
                "display_name": "Merchant",
                "description": "Merchant role has access to merchant resources",
            },
            {
                "name": "customer",
                "display_name": "Customer",
                "description": "Customer role has access to customer resources",
            }
        ];
        roles.forEach(async (role) => {
            await Role.create(role);
        });
        console.log('Roles seeded successfully');
    } catch (err) {
        console.error('Error seeding roles', err);
    }
}

module.exports = { seedRoles };