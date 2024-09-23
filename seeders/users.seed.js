'use strict';

const { User, Role, UserRole } = require('../models');

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
            // {
            //     "name": "Customer",
            //     "email": "customer@customer.com",
            //     "password": "password",
            //     "role": "customer",
            //     "locale": "en",
            //     "landingPage": "/customer"
            // },
            // {
            //     "name": "Customer",
            //     "email": "customer@customer.com",
            //     "password": "password",
            //     "role": "customer",
            //     "locale": "en",
            //     "landingPage": "/customer"
            // },
            // {
            //     "name": "Customer",
            //     "email": "customer@customer.com",
            //     "password": "password",
            //     "role": "customer",
            //     "locale": "en",
            //     "landingPage": "/customer"
            // },
            // {
            //     "name": "Customer",
            //     "email": "customer@customer.com",
            //     "password": "password",
            //     "role": "customer",
            //     "locale": "en",
            //     "landingPage": "/customer"
            // },
            // {
            //     "name": "Customer",
            //     "email": "customer@customer.com",
            //     "password": "password",
            //     "role": "customer",
            //     "locale": "en",
            //     "landingPage": "/customer"
            // },
            // {
            //     "name": "Customer",
            //     "email": "customer@customer.com",
            //     "password": "password",
            //     "role": "customer",
            //     "locale": "en",
            //     "landingPage": "/customer"
            // },
            // {
            //     "name": "Customer",
            //     "email": "customer@customer.com",
            //     "password": "password",
            //     "role": "customer",
            //     "locale": "en",
            //     "landingPage": "/customer"
            // },
            // {
            //     "name": "Customer",
            //     "email": "customer@customer.com",
            //     "password": "password",
            //     "role": "customer",
            //     "locale": "en",
            //     "landingPage": "/customer"
            // },
            // {
            //     "name": "Customer",
            //     "email": "customer@customer.com",
            //     "password": "password",
            //     "role": "customer",
            //     "locale": "en",
            //     "landingPage": "/customer"
            // },
            // {
            //     "name": "Customer",
            //     "email": "customer@customer.com",
            //     "password": "password",
            //     "role": "customer",
            //     "locale": "en",
            //     "landingPage": "/customer"
            // },
            // {
            //     "name": "Customer",
            //     "email": "customer@customer.com",
            //     "password": "password",
            //     "role": "customer",
            //     "locale": "en",
            //     "landingPage": "/customer"
            // },
            // {
            //     "name": "Customer",
            //     "email": "customer@customer.com",
            //     "password": "password",
            //     "role": "customer",
            //     "locale": "en",
            //     "landingPage": "/customer"
            // },
            // {
            //     "name": "Customer",
            //     "email": "customer@customer.com",
            //     "password": "password",
            //     "role": "customer",
            //     "locale": "en",
            //     "landingPage": "/customer"
            // },
            // {
            //     "name": "Customer",
            //     "email": "customer@customer.com",
            //     "password": "password",
            //     "role": "customer",
            //     "locale": "en",
            //     "landingPage": "/customer"
            // },
            // {
            //     "name": "Customer",
            //     "email": "customer@customer.com",
            //     "password": "password",
            //     "role": "customer",
            //     "locale": "en",
            //     "landingPage": "/customer"
            // },
            // {
            //     "name": "Customer",
            //     "email": "customer@customer.com",
            //     "password": "password",
            //     "role": "customer",
            //     "locale": "en",
            //     "landingPage": "/customer"
            // },
            // {
            //     "name": "Customer",
            //     "email": "customer@customer.com",
            //     "password": "password",
            //     "role": "customer",
            //     "locale": "en",
            //     "landingPage": "/customer"
            // },
            // {
            //     "name": "Customer",
            //     "email": "customer@customer.com",
            //     "password": "password",
            //     "role": "customer",
            //     "locale": "en",
            //     "landingPage": "/customer"
            // }
        ];
        users.forEach(async (user) => {
            const newUser = await User.create({
                name: user.name,
                email: user.email,
                password: user.password,
                locale: user.locale,
                landingPage: user.landingPage
            });

            const role = await Role.findOne({ where: { name: user.role } });
            if (role) {
                await UserRole.create({
                    user_id: newUser.id,
                    role_id: role.id,
                    user_type: user.role,
                });
            }
        });

        console.log('Users seeded successfully');
    } catch (err) {
        console.error('Error seeding users', err);
    }
}

module.exports = { seedUsers };

//1. npx sequelize-cli seed:generate --name seed-users
//2. 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkInsert('Users', [
//       {
//         name: 'John Doe',
//         email: 'john@example.com',
//         password: 'password123', // Hash this if necessary
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         name: 'Jane Smith',
//         email: 'jane@example.com',
//         password: 'password123',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     ]);
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkDelete('Users', null, {});
//   }
// };

//3. npx sequelize-cli db:seed:all
