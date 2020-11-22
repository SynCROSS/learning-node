const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

describe('isLoggedIn', () => {
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();

  test(`isLoggedIn' must Call 'next' when Logged In.`, () => {
    const req = { isAuthenticated: jest.fn(() => true) };
    isLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);
  });

  test(`'isLoggedIn' should Respond an Error when NOT Logged In.`, () => {
    const req = { isAuthenticated: jest.fn(() => false) };
    isLoggedIn(req, res, next);
    expect(res.status).toBeCalledWith(403);
    expect(res.send).toBeCalledWith('Login is Required');
  });
});

describe('isNotLoggedIn', () => {
  const res = {
    redirect: jest.fn(),
  };
  const next = jest.fn();

  test(`isNotLoggedIn' should Respond an Error when Logged In.`, () => {
    const req = { isAuthenticated: jest.fn(() => true) };
    isLoggedIn(req, res, next);
    const message = encodeURIComponent("You're Logged In.");
    expect(res.redirect).toBeCalledWith(`/?error=${message}`);
  });

  test(`'isNotLoggedIn' must Call 'next' when NOT Logged In.`, () => {
    const req = { isAuthenticated: jest.fn(() => false) };
    isLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);
  });
});
