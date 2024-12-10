'use strict';

const { name } = require('ejs');
const { User, Role, UserRole } = require('../models');

const seedUsers = async () => {
    try {
        const users = [
            {
                role: 'Admin',
                name: 'Admin User',
                email: 'admin@involink.com',
                phone_number: '0710000000',
                password: 'admin123',
                locale: 'en',
                landing_page: '/dashboard',
                enabled: true,
            },
            {
                role: 'Merchant',
                name: 'Merchant User',
                email: 'merchant@involink.com',
                phone_number: '0720000000',
                password: 'merchant123',
                locale: 'en',
                landing_page: '/stores',
                enabled: true,
            },
            {
                role: 'Employee',
                name: 'Employee User',
                email: 'employee@involink.com',
                phone_number: '0730000000',
                password: 'employee123',
                locale: 'en',
                landing_page: '/tasks',
                enabled: true,
            },
            {
                role: 'Auditor',
                name: 'Auditor User',
                email: 'auditor@involink.com',
                phone_number: '0740000000',
                password: 'auditor123',
                locale: 'en',
                landing_page: '/reports',
                enabled: true,
            },
            {
                role: 'Customer',
                name: 'Customer User',
                email: 'customer@involink.com',
                phone_number: '0750000000',
                password: 'customer123',
                locale: 'en',
                landing_page: '/profile',
                enabled: true,
            }
        ];

        for (const user of users) {
            // Create the user
            const newUser = await User.create({
                name: user.name,
                email: user.email,
                phone_number: user.phone_number,
                password: user.password,
                locale: user.locale,
                landing_page: user.landing_page,
                enabled: user.enabled,
            });

            // Assign role to user
            const role = await Role.findOne({ where: { name: user.role } });
            if (role) {
                await role.addUser(newUser);
            }
        }

        console.log('Users seeded successfully with roles');
    } catch (err) {
        console.error('Error seeding users:', err);
    }
};

module.exports = { seedUsers };
