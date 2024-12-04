'use strict';

const { User, Role, UserRole } = require('../models');

const seedUsers = async () => {
    try {
        const users = [
            {
                name: 'Admin User',
                email: 'admin@involink.com',
                password: 'admin123',
                role: 'Admin',
                locale: 'en',
                landing_page: '/dashboard',
                enabled: true,
            },
            {
                name: 'Store Owner User',
                email: 'owner@involink.com',
                password: 'owner123',
                role: 'Store Owner',
                locale: 'en',
                landing_page: '/stores',
                enabled: true,
            },
            {
                name: 'Employee User',
                email: 'employee@involink.com',
                password: 'employee123',
                role: 'Employee',
                locale: 'en',
                landing_page: '/tasks',
                enabled: true,
            },
            {
                name: 'Auditor User',
                email: 'auditor@involink.com',
                password: 'auditor123',
                role: 'Auditor',
                locale: 'en',
                landing_page: '/reports',
                enabled: true,
            },
        ];

        for (const user of users) {
            // Create the user
            const newUser = await User.create({
                name: user.name,
                email: user.email,
                password: user.password,
                locale: user.locale,
                landing_page: user.landing_page,
                enabled: user.enabled,
            });

            // Assign role to user
            const role = await Role.findOne({ where: { name: user.role } });
            if (role) {
                await UserRole.create({
                    user_id: newUser.id,
                    role_id: role.id,
                });
            }
        }

        console.log('Users seeded successfully with roles');
    } catch (err) {
        console.error('Error seeding users:', err);
    }
};

module.exports = { seedUsers };
