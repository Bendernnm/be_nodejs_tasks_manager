const mongodb = require('mongodb');

const security = require('../../helpers/security');

const { Errors } = require('../../helpers/error');

module.exports = async ({ db, body, headers, now }) => {
  const { email, password } = body;
  const deviceId = headers['device-id'];

  if (!deviceId) {
    throw Errors.notValidParameter({ target: 'Header Device-Id', message: 'Not valid device id' });
  }

  const userModelWithSameEmail = await db.collections.users.findOne({ email });

  if (userModelWithSameEmail) {
    throw Errors.badRequest({ target: 'user', message: 'email already used' });
  }

  const userId = new mongodb.ObjectId();
  const authorizationToken = security.generateSimpleToken();

  const hashedPassword = await security.hash(password);

  await db.collections.session.insertOne({
    userId,
    deviceId,
    authorizationToken,
    createdAt: now,
    updatedAt: now,
  });

  await db.collections.users.insertOne({
    email,
    createdAt: now,
    updatedAt: now,
    _id      : userId,
    password : hashedPassword,
  });

  return {
    status: 201,
    data  : {
      authorizationToken,
      userId: userId.toString(),
    },
  };
};
