
const {customAlphabet} = require('nanoid');

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 36);

const getId = () => {
  return nanoid();
};

module.exports = {getId};
