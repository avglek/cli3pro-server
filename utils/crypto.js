const CryptoJS = require('crypto-js');

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, 'secret key').toString();
};

const decrypt = (hash) => {
  const bytes = CryptoJS.AES.decrypt(hash, 'secret key');
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = {
  encrypt,
  decrypt,
};
