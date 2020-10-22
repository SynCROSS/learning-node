require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/dotenv').config();
const { MONGO_URI } = process.env;
const mongoose = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/mongoose');

const connect = () => {
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }
  mongoose.connect(
    MONGO_URI,
    { dbName: 'nodejs', useNewUrlParser: true, useCreateIndex: true },
    error => {
      if (error) {
        console.log('Connection Error:', error);
      } else {
        console.log('Connection Successful!');
      }
    },
  );
};
mongoose.connection.on('error', error => {
  console.error('Connection Error:', error);
});
mongoose.connection.on('disconnected', () => {
  console.error('Connection Disconnected. Try Connecting Again.');
  connect();
});

module.exports = connect;
