const security = require('../../helpers/security');

const { Errors } = require('../../helpers/error');

module.exports = async ({ db, body, headers, now }) => {
  const { email, password } = body;
  const deviceId = headers['device-id'];

  if (!deviceId) {
    throw Errors.notValidParameter({ target: 'Header Device-Id', message: 'Not valid device id' });
  }

  const userModel = await db.collections.users.findOne({ email });

  if (!userModel) {
    throw Errors.notFoundObject('user');
  }

  const passwordIsEquals = await security.compare(password, userModel.password);

  if (!passwordIsEquals) {
    throw Errors.notFoundObject('user');
  }

  const userId = userModel._id;

  const sessionModel = await db.collections.session.findOne({ deviceId, userId });


  const authorizationToken = security.generateSimpleToken();
  const update = { authorizationToken, updatedAt: now };

  if (!sessionModel) {
    update.createdAt = now;
  }

  await db.collections.session.updateOne(
    { deviceId, userId },
    { $set: update },
    { upsert: true },
  );

  return {
    status: 200,
    data  : {
      authorizationToken,
      userId: userId.toString(),
    },
  };
};
