'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create admin user
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const adminUser = await queryInterface.bulkInsert('users', [{
      name: 'System Administrator',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      address: '123 Admin Street, Admin City',
      createdAt: new Date(),
      updatedAt: new Date()
    }], { returning: true });

    // Create store owners
    const ownerPassword = await bcrypt.hash('Owner@123', 10);
    const owners = await queryInterface.bulkInsert('users', [
      {
        name: 'John Doe Store Owner',
        email: 'john.doe@example.com',
        password: ownerPassword,
        role: 'owner',
        address: '456 Owner Ave, Business District',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jane Smith Store Owner',
        email: 'jane.smith@example.com',
        password: ownerPassword,
        role: 'owner',
        address: '789 Commerce St, Market Area',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Create regular users
    const userPassword = await bcrypt.hash('User@123', 10);
    const users = await queryInterface.bulkInsert('users', [
      {
        name: 'Regular User One',
        email: 'user1@example.com',
        password: userPassword,
        role: 'user',
        address: '101 User Lane, Customer City',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Regular User Two',
        email: 'user2@example.com',
        password: userPassword,
        role: 'user',
        address: '202 Shopper Blvd, Retail District',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Create stores
    const stores = await queryInterface.bulkInsert('stores', [
      {
        name: 'John\'s Electronics',
        email: 'johns.electronics@example.com',
        address: '123 Tech Park, Silicon Valley',
        owner_id: owners[0].id,
        avg_rating: 4.5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jane\'s Bookstore',
        email: 'janes.books@example.com',
        address: '456 Literature Lane, Downtown',
        owner_id: owners[1].id,
        avg_rating: 4.2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tech Haven',
        email: 'tech.haven@example.com',
        address: '789 Gadget Road, Tech Center',
        owner_id: owners[0].id,
        avg_rating: 4.0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Create ratings
    await queryInterface.bulkInsert('ratings', [
      // Ratings for John's Electronics
      {
        user_id: users[0].id,
        store_id: stores[0].id,
        rating_value: 5,
        comment: 'Great selection of electronics!',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: users[1].id,
        store_id: stores[0].id,
        rating_value: 4,
        comment: 'Good prices, but limited stock.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Ratings for Jane's Bookstore
      {
        user_id: users[0].id,
        store_id: stores[1].id,
        rating_value: 5,
        comment: 'Amazing collection of books!',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: users[1].id,
        store_id: stores[1].id,
        rating_value: 3,
        comment: 'Nice ambiance but could have more variety.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Ratings for Tech Haven
      {
        user_id: users[0].id,
        store_id: stores[2].id,
        rating_value: 4,
        comment: 'Helpful staff and good deals.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: users[1].id,
        store_id: stores[2].id,
        rating_value: 4,
        comment: 'Great place for tech enthusiasts!',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Delete all data from tables in reverse order
    await queryInterface.bulkDelete('ratings', null, {});
    await queryInterface.bulkDelete('stores', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
