const mongoose = require('mongoose');

const { MONGO_ID, MONGO_PASSWORD, NODE_ENV } = process.env;

const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`;

const connect = () => {
  if (NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }
  mongoose.connect(
    MONGO_URL,
    {
      dbName: 'gifchat',
      useNewUrlParser: true,
      useCreateIndex: true,
    },
    error => {
      if (error) {
        console.log('Connection Error:', error);
      } else {
        console.log('Connection Successful');
      }
    },
  );
};

mongoose.connection.on('error', error => {
  console.error('Connection Error:', error);
});
mongoose.connection.on('disconnected', () => {
  console.error('Connection is Broken. Retrying the Connection');
  connect();
});

module.exports = connect;
