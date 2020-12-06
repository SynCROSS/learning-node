const request = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/supertest');
const { sequelize } = require('../models');
const app = require('../app.js');

beforeAll(async () => {
  await sequelize.sync();
});

describe('POST /join', () => {
  test("Register if You don't login.", async done => {
    request(app)
      .post('/auth/join')
      .send({ email: 'jenofire3125@gmail.com', nick: 'test', password: '1234' })
      .expect('Location', '/')
      .expect(302, done);
  });
});

describe('POST /join', () => {
  const agent = request.agent(app);
  beforeEach(done => {
    agent
      .post('/auth/login')
      .send({ email: 'jenofire3125@gmail.com', password: '1234' })
      .end(done);
  });

  test('Redirect / if you already logged in.', done => {
    const message = encodeURIComponent("You're logged in");
    agent
      .post('/auth/join')
      .send({ email: 'jenofire3125@gmail.com', nick: 'test', password: '1234' })
      .expect('Locaion', `/?error=${message}`)
      .expect(302, done);
  });
});

describe('POST /login', () => {
  test('Unregistered Member', async done => {
    const message = encodeURIComponent("You're an Unregistered Member.");
    request(app)
      .post('/auth/login')
      .send({ email: 'jenofire3125@gmail.com', password: '1234' })
      .expect('Location', `/?loginError=${message}`)
      .expect(302, done);
  });

  test('Do login', async done => {
    request(app)
      .post('/auth/login')
      .send({ email: 'jenofire3125@gmail.com', password: '1234' })
      .expect('Location', '/')
      .expect(302, done);
  });

  test('Wrong Password', async done => {
    const message = encodeURIComponent('Passwords do not match.');
    request(app)
      .post('/auth/login')
      .send({
        email: 'jenofire3125@gmail.com',
        password: 'you pick the wrong password fool',
      })
      .expect('Location', `/?loginError=${message}`)
      .expect(302, done);
  });
});

describe('GET /logout', () => {
  test("403 if you didn't login", async done => {
    request(app).get('/auth/logout').expect(403, done);
  });

  const agent = request.agent(app);
  beforeEach(done => {
    agent
      .post('/auth/login')
      .send({ email: 'jenofire3125@gmail.com', password: '1234' })
      .end(done);
  });

  test('Do logout', async done => {
    const message = encodeURIComponent('Passwords do not match.');
    agent.get('/auth/logout').expect('Location', '/').expect(302, done);
  });
});

afterAll(async () => {
  await sequelize.sync({ force: true });
});
