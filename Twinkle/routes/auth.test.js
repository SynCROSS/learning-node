const request = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/supertest');
const { sequelize } = require('../models');
const app = require('../app.js');

beforeAll(async () => {
  await sequelize.sync();
});

describe('POST /login', () => {
  test('Do Login', async done => {
    request(app)
      .post('/auth/login')
      .send({ email: 'jenofire3125@gmail.com', password: '1234' })
      .expect('Location', '/')
      .expect(302, done);
  });
});
