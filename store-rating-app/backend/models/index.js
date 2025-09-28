const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user.model')(sequelize, Sequelize);
db.Store = require('./store.model')(sequelize, Sequelize);
db.Rating = require('./rating.model')(sequelize, Sequelize);

// Define relationships

// User has many Stores (One-to-Many)
db.User.hasMany(db.Store, {
  foreignKey: 'owner_id',
  as: 'stores'
});
db.Store.belongsTo(db.User, {
  foreignKey: 'owner_id',
  as: 'owner'
});

// User has many Ratings (One-to-Many)
db.User.hasMany(db.Rating, {
  foreignKey: 'user_id',
  as: 'ratings'
});
db.Rating.belongsTo(db.User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Store has many Ratings (One-to-Many)
db.Store.hasMany(db.Rating, {
  foreignKey: 'store_id',
  as: 'ratings'
});
db.Rating.belongsTo(db.Store, {
  foreignKey: 'store_id',
  as: 'store'
});

// Add a hook to update store's average rating when a rating is added/updated/deleted
const updateStoreAvgRating = async (rating, options) => {
  try {
    const store = await db.Store.findByPk(rating.store_id, {
      include: [{
        model: db.Rating,
        as: 'ratings',
        attributes: []
      }],
      attributes: [
        [db.sequelize.fn('AVG', db.sequelize.col('ratings.rating_value')), 'new_avg_rating']
      ],
      group: ['Store.id'],
      raw: true
    });

    if (store) {
      await db.Store.update(
        { avg_rating: parseFloat(store.new_avg_rating || 0).toFixed(1) },
        { where: { id: rating.store_id } }
      );
    }
  } catch (error) {
    console.error('Error updating store average rating:', error);
  }
};

db.Rating.afterCreate(updateStoreAvgRating);
db.Rating.afterUpdate(updateStoreAvgRating);
db.Rating.afterDestroy(updateStoreAvgRating);

module.exports = db;
