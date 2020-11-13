const Sequelize = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const User = require('./user');
const Post = require('./post');
const Hashtag = require('./hashtag');
const Domain = require('../models/domain.js');

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.sequelize = sequelize;

db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;
db.Domain = Domain;

User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);
Domain.init(sequelize);

User.associate(db);
Post.associate(db);
Hashtag.associate(db);
Domain.associate(db);

module.exports = db;
