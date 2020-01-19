const uuid = require('uuid');
const moment = require('moment');
const bcrypt = require('bcrypt');
const Cryptr = require('cryptr');
const jwt = require('jwt-simple');

const config = require('../../config');

const cryptr = new Cryptr(config.CODER_SECRET_KEY);

module.exports.cryptEncrypt = str => cryptr.encrypt(str);

module.exports.cryptDecrypt = str => cryptr.decrypt(str);

module.exports.cryptEncryptSeveral = (...args) => args.map(str => cryptr.encrypt(str));

module.exports.cryptDecryptSeveral = (...args) => args.map(str => cryptr.decrypt(str));

module.exports.generateSimpleToken = () => cryptr.encrypt(uuid.v4());

// async function, create hash for password
module.exports.hash = password => bcrypt.hash(password, 4);

// async function, check password
module.exports.compare = (password, hash) => {
  return bcrypt.compare(password, hash);
};

// {_id: <userId>}
module.exports.encodeJWT = (payload = {}, duration = 60 * 15) => {
  payload || (payload = {});

  payload.exp = moment().add(duration, 'seconds').format('X');

  return cryptr.encrypt(jwt.encode(payload, config.JWT_TOKEN_SECRET, 'HS256', {}));
};

module.exports.verifyJWT = token => {
  jwt.decode(token, config.JWT_TOKEN_SECRET, true, 'HS256'); //  decoded

  return true;
};

module.exports.generatePassword = (length = 8) => {
  let password = '';
  let character = '';
  let numeric = '0123456789';
  const string = 'abcdefghijklmnopqrstuvwxyz';

  while (password.length < length) {
    let entity1 = Math.ceil(string.length * Math.random() * Math.random());
    let entity2 = Math.ceil(numeric.length * Math.random() * Math.random());

    let hold = string.charAt(entity1);

    if (entity1 % 2 === 0) {
      hold.toUpperCase();
    }

    character += hold;
    character += numeric.charAt(entity2);

    password = character;
  }
  return password;
};
