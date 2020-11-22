jest.mock('../models/user.js');
const User = require('../models/user.js');
const { addFollowing } = require('./user.js');

describe('addFollowing', () => {
  const req = { user: { id: 1 }, params: { id: 2 } };
  const res = { status: jest.fn(() => res), send: jest.fn() };
  const next = jest.fn();

  test(`Need to Find the User, Add Followings, And Respond 'success'`, async () => {
    User.findOne.mockReturnValue(
      Promise.resolve({
        addFollowing(id) {
          return Promise.resolve(true);
        },
      }),
    );
    await addFollowing(req, res, next);
    expect(res.send).toBeCalledWith('success');
  });

  test(`Call 'res.status(404).send(no user)' If It Can't Find The User.`, async () => {
    User.findOne.mockReturnValue(null);
    await addFollowing(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith('No User');
  });

  test(`Call 'next' When DB had The Error`, async () => {
    const e = 'An Error for Test.';
    User.findOne.mockReturnValue(Promise.reject(e));
    await addFollowing(req, res, next);
    expect(next).toBeCalledWith(e);
  });
});
