const Sequelize = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/sequelize');
const User = require('./user.js');
const config = require('../config/config.json')['test'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

describe('User Model', () => {
  test(`Call 'static init' method.`, () => {
    expect(User.init(sequelize)).toBe(User);
  });
  test(`Call 'static associate' method.`, () => {
    const db = {
      User: { hasMany: jest.fn(), belongsToMany: jest.fn() },
      Post: {},
    };
    User.associate(db);
    expect(db.User.hasMany).toHaveBeenCalledWith(db.Post);
    expect(db.User.belongsToMany).toHaveBeenCalledTimes(2);
  });
});
