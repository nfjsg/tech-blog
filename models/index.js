const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const models = {
  User: require('./User'),
  Post: require('./Post'),
  Comment: require('./Comment'),
};

// Define associations here
models.User.hasMany(models.Post, { foreignKey: 'userId' });
models.Post.belongsTo(models.User, { foreignKey: 'userId' });

models.User.hasMany(models.Comment, { foreignKey: 'userId' });
models.Comment.belongsTo(models.User, { foreignKey: 'userId' });

models.Post.hasMany(models.Comment, { foreignKey: 'postId' });
models.Comment.belongsTo(models.Post, { foreignKey: 'postId' });

// Export the models and Sequelize instance
module.exports = { sequelize, ...models };
