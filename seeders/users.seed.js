'use strict';

const { User } = require('../models');

const seedUsers = async () => {
    try {
        const users = [
            {
                "name": "Admin",
                "email": "admin@admin.com",
                "password": "password",
                "role": "admin",
                "locale": "en",
                "landingPage": "/admin"
            },
            {
                "name": "Merchant",
                "email": "merchant@merchant.com",
                "password": "password",
                "role": "merchant",
                "locale": "en",
                "landingPage": "/merchant"
            },
            {
                "name": "Customer",
                "email": "customer@customer.com",
                "password": "password",
                "role": "customer",
                "locale": "en",
                "landingPage": "/customer"
            },
            {
                "name": "Customer",
                "email": "customer@customer.com",
                "password": "password",
                "role": "customer",
                "locale": "en",
                "landingPage": "/customer"
            },
            {
                "name": "Customer",
                "email": "customer@customer.com",
                "password": "password",
                "role": "customer",
                "locale": "en",
                "landingPage": "/customer"
            },
            {
                "name": "Customer",
                "email": "customer@customer.com",
                "password": "password",
                "role": "customer",
                "locale": "en",
                "landingPage": "/customer"
            },
            {
                "name": "Customer",
                "email": "customer@customer.com",
                "password": "password",
                "role": "customer",
                "locale": "en",
                "landingPage": "/customer"
            },
            {
                "name": "Customer",
                "email": "customer@customer.com",
                "password": "password",
                "role": "customer",
                "locale": "en",
                "landingPage": "/customer"
            },
            {
                "name": "Customer",
                "email": "customer@customer.com",
                "password": "password",
                "role": "customer",
                "locale": "en",
                "landingPage": "/customer"
            },
            {
                "name": "Customer",
                "email": "customer@customer.com",
                "password": "password",
                "role": "customer",
                "locale": "en",
                "landingPage": "/customer"
            },
            {
                "name": "Customer",
                "email": "customer@customer.com",
                "password": "password",
                "role": "customer",
                "locale": "en",
                "landingPage": "/customer"
            },
            {
                "name": "Customer",
                "email": "customer@customer.com",
                "password": "password",
                "role": "customer",
                "locale": "en",
                "landingPage": "/customer"
            },
            {
                "name": "Customer",
                "email": "customer@customer.com",
                "password": "password",
                "role": "customer",
                "locale": "en",
                "landingPage": "/customer"
            },
            {
                "name": "Customer",
                "email": "customer@customer.com",
                "password": "password",
                "role": "customer",
                "locale": "en",
                "landingPage": "/customer"
            },
            {
                "name": "Customer",
                "email": "customer@customer.com",
                "password": "password",
                "role": "customer",
                "locale": "en",
                "landingPage": "/customer"
            },
            {
                "name": "Customer",
                "email": "customer@customer.com",
                "password": "password",
                "role": "customer",
                "locale": "en",
                "landingPage": "/customer"
            },
            {
                "name": "Customer",
                "email": "customer@customer.com",
                "password": "password",
                "role": "customer",
                "locale": "en",
                "landingPage": "/customer"
            },
            {
                "name": "Customer",
                "email": "customer@customer.com",
                "password": "password",
                "role": "customer",
                "locale": "en",
                "landingPage": "/customer"
            },
            {
                "name": "Customer",
                "email": "customer@customer.com",
                "password": "password",
                "role": "customer",
                "locale": "en",
                "landingPage": "/customer"
            },
            {
                "name": "Customer",
                "email": "customer@customer.com",
                "password": "password",
                "role": "customer",
                "locale": "en",
                "landingPage": "/customer"
            },
            {
                "name": "Customer",
                "email": "customer@customer.com",
                "password": "password",
                "role": "customer",
                "locale": "en",
                "landingPage": "/customer"
            }
        ];
        users.forEach(async (user) => {
            await User.create(user);
        });
        console.log('Users seeded successfully');
    } catch (err) {
        console.error('Error seeding users', err);
    }
}

module.exports = { seedUsers };
