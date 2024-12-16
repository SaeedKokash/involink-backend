'use strict';

const { User, Role } = require('../models');

const seedUsers = async () => {
    try {
        const users = [
            {
                role: 'Admin',
                name: 'Admin User',
                email: 'admin@involink.com',
                phone_number: '0710000000',
                password: 'password',
                locale: 'en',
                landing_page: '/dashboard',
                enabled: true,
                email_verified: true,
            },
            {
                role: 'Merchant',
                name: 'Merchant User',
                email: 'merchant@involink.com',
                phone_number: '0720000000',
                password: 'password',
                locale: 'en',
                landing_page: '/stores',
                enabled: true,
                email_verified: true,
            },
            {
                role: 'Employee',
                name: 'Employee User',
                email: 'employee@involink.com',
                phone_number: '0730000000',
                password: 'password',
                locale: 'en',
                landing_page: '/tasks',
                enabled: true,
                email_verified: true,
            },
            {
                role: 'Customer',
                name: 'Customer User',
                email: 'customer@involink.com',
                phone_number: '0750000000',
                password: 'password',
                locale: 'en',
                landing_page: '/profile',
                enabled: true,
                email_verified: true,
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
                email_verified: user.email_verified,
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
